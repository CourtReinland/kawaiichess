import { describe, expect, it } from 'vitest';
import { createBattleState, switchTurn } from './board';
import { generateEnemyMove } from './ai-engine';

describe('generateEnemyMove', () => {
  it('returns a legal move for the enemy', () => {
    let state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [{ definitionId: 'rook', position: { x: 4, y: 7 } }],
    );
    state = switchTurn(state);
    const move = generateEnemyMove(state, 2);
    expect(move).toBeDefined();
    expect(state.pieces.find((p) => p.id === move?.pieceId)?.side).toBe('enemy');
  });

  it('captures the player king when possible', () => {
    let state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 6 } }],
      [{ definitionId: 'rook', position: { x: 4, y: 7 } }],
    );
    state = switchTurn(state);
    const move = generateEnemyMove(state, 2);
    expect(move?.to).toEqual({ x: 4, y: 6 });
    expect(move?.capture).toBeDefined();
  });

  it('returns null when enemy has pieces but no legal moves', () => {
    let state = createBattleState(
      [
        { definitionId: 'king', position: { x: 4, y: 0 } },
        { definitionId: 'rook', position: { x: 4, y: 6 } },
        { definitionId: 'rook', position: { x: 5, y: 6 } },
        { definitionId: 'rook', position: { x: 3, y: 6 } },
        { definitionId: 'rook', position: { x: 4, y: 5 } },
      ],
      [{ definitionId: 'king', position: { x: 4, y: 7 } }],
    );
    state = switchTurn(state);
    const move = generateEnemyMove(state, 2);
    expect(move).toBeNull();
  });

  it('returns undefined when no enemy pieces exist', () => {
    let state = createBattleState([{ definitionId: 'king', position: { x: 4, y: 0 } }], []);
    state = switchTurn(state);
    const move = generateEnemyMove(state, 2);
    expect(move).toBeUndefined();
  });

  it('scales difficulty with depth', () => {
    let state = createBattleState(
      [
        { definitionId: 'king', position: { x: 4, y: 0 } },
        { definitionId: 'pawn', position: { x: 3, y: 1 } },
      ],
      [
        { definitionId: 'king', position: { x: 4, y: 7 } },
        { definitionId: 'rook', position: { x: 0, y: 7 } },
      ],
    );
    state = switchTurn(state);
    // Should still return a move even at higher difficulty.
    const move = generateEnemyMove(state, 4);
    expect(move).toBeDefined();
  });
});
