import { describe, expect, it } from 'vitest';
import { createBattleState, switchTurn } from './board';
import { generateEnemyMove } from './ai';

describe('enemy AI', () => {
  it('picks a move when it is the enemy turn', () => {
    let state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [{ definitionId: 'rook', position: { x: 4, y: 7 } }],
    );
    state = switchTurn(state);
    const move = generateEnemyMove(state);
    expect(move).toBeDefined();
    expect(move?.pieceId).toBe(state.pieces[1].id);
  });

  it('prefers capturing the player king', () => {
    let state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 6 } }],
      [{ definitionId: 'rook', position: { x: 4, y: 7 } }],
    );
    state = switchTurn(state);
    const move = generateEnemyMove(state);
    expect(move?.to).toEqual({ x: 4, y: 6 });
    expect(move?.capture).toBeDefined();
  });

  it('returns undefined when no enemy pieces exist', () => {
    let state = createBattleState(
      [{ definitionId: 'king', position: { x: 4, y: 0 } }],
      [],
    );
    state = switchTurn(state);
    const move = generateEnemyMove(state);
    expect(move).toBeUndefined();
  });
});
