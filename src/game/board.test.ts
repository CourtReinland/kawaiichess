import { describe, expect, it } from 'vitest';
import {
  applyMove,
  checkBattleEnd,
  createBattleState,
  findRoyal,
  getPieceAt,
  getValidMoves,
  isValidPosition,
  positionsEqual,
  switchTurn,
} from './board';
import type { Move } from './types';

describe('board basics', () => {
  it('validates board positions', () => {
    expect(isValidPosition({ x: 0, y: 0 })).toBe(true);
    expect(isValidPosition({ x: 7, y: 7 })).toBe(true);
    expect(isValidPosition({ x: 8, y: 0 })).toBe(false);
    expect(isValidPosition({ x: -1, y: 0 })).toBe(false);
  });

  it('compares positions', () => {
    expect(positionsEqual({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    expect(positionsEqual({ x: 1, y: 2 }, { x: 2, y: 1 })).toBe(false);
  });
});

describe('createBattleState', () => {
  it('creates a board with player and enemy pieces', () => {
    const state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [{ definitionId: 'king', position: { x: 4, y: 7 } }],
    );
    expect(state.pieces).toHaveLength(2);
    expect(findRoyal(state, 'player')).toBeDefined();
    expect(findRoyal(state, 'enemy')).toBeDefined();
    expect(state.turn).toBe('player');
  });
});

describe('move generation', () => {
  it('generates rook moves', () => {
    const state = createBattleState(
      [{ definitionId: 'rook', position: { x: 3, y: 3 } }],
      [],
    );
    const moves = getValidMoves(state, state.pieces[0].id);
    expect(moves.length).toBe(14);
  });

  it('generates knight moves', () => {
    const state = createBattleState(
      [{ definitionId: 'knight', position: { x: 3, y: 3 } }],
      [],
    );
    const moves = getValidMoves(state, state.pieces[0].id);
    expect(moves.length).toBe(8);
  });

  it('generates king moves', () => {
    const state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 4 } }],
      [],
    );
    const moves = getValidMoves(state, state.pieces[0].id);
    expect(moves.length).toBe(8);
  });

  it('allows capturing enemy pieces', () => {
    const state = createBattleState(
      [{ definitionId: 'rook', position: { x: 3, y: 3 } }],
      [{ definitionId: 'pawn', position: { x: 3, y: 6 } }],
    );
    const moves = getValidMoves(state, state.pieces[0].id);
    const capture = moves.find((m) => m.to.x === 3 && m.to.y === 6);
    expect(capture).toBeDefined();
    expect(capture?.capture).toBeDefined();
  });

  it('blocks movement through friendly pieces', () => {
    const state = createBattleState(
      [
        { definitionId: 'rook', position: { x: 3, y: 3 } },
        { definitionId: 'pawn', position: { x: 3, y: 5 } },
      ],
      [],
    );
    const moves = getValidMoves(state, state.pieces[0].id);
    const beyondBlock = moves.find((m) => m.to.x === 3 && m.to.y === 6);
    expect(beyondBlock).toBeUndefined();
  });

  it('generates pawn initial two-step', () => {
    const state = createBattleState(
      [{ definitionId: 'pawn', position: { x: 3, y: 1 } }],
      [],
    );
    const moves = getValidMoves(state, state.pieces[0].id);
    expect(moves.some((m) => m.to.x === 3 && m.to.y === 3)).toBe(true);
  });
});

describe('applyMove', () => {
  it('moves a piece', () => {
    const state = createBattleState(
      [{ definitionId: 'rook', position: { x: 3, y: 3 } }],
      [],
    );
    const piece = state.pieces[0];
    const move: Move = { pieceId: piece.id, from: piece.position, to: { x: 3, y: 6 } };
    const next = applyMove(state, move);
    expect(getPieceAt(next, { x: 3, y: 6 })?.id).toBe(piece.id);
    expect(getPieceAt(next, { x: 3, y: 3 })).toBeUndefined();
  });

  it('captures an enemy piece', () => {
    const state = createBattleState(
      [{ definitionId: 'rook', position: { x: 3, y: 3 } }],
      [{ definitionId: 'king', position: { x: 3, y: 6 } }],
    );
    const piece = state.pieces[0];
    const move: Move = { pieceId: piece.id, from: piece.position, to: { x: 3, y: 6 }, capture: state.pieces[1] };
    const next = applyMove(state, move);
    expect(next.pieces).toHaveLength(1);
    expect(findRoyal(next, 'enemy')).toBeUndefined();
  });

  it('switches turn', () => {
    const state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [{ definitionId: 'king', position: { x: 4, y: 7 } }],
    );
    expect(switchTurn(state).turn).toBe('enemy');
  });
});

describe('checkBattleEnd', () => {
  it('detects victory when enemy king is captured', () => {
    const state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [{ definitionId: 'king', position: { x: 4, y: 7 } }],
    );
    const piece = state.pieces[0];
    const move: Move = { pieceId: piece.id, from: piece.position, to: { x: 4, y: 7 }, capture: state.pieces[1] };
    const next = checkBattleEnd(applyMove(state, move));
    expect(next.phase).toBe('victory');
  });

  it('detects defeat when player king is captured', () => {
    const state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [{ definitionId: 'rook', position: { x: 4, y: 7 } }],
    );
    const enemy = state.pieces[1];
    const move: Move = { pieceId: enemy.id, from: enemy.position, to: { x: 4, y: 0 }, capture: state.pieces[0] };
    const next = checkBattleEnd(applyMove(state, move));
    expect(next.phase).toBe('defeat');
  });
});
