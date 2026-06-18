import { describe, expect, it } from 'vitest';
import { createBattleState, findRoyal, applyMove, checkBattleEnd } from './board';
import { buildStages, defaultPlayerArmy, placePlayerArmy } from './run';

describe('stage royal check', () => {
  it('every stage has an enemy royal', () => {
    const stages = buildStages();
    for (const stage of stages) {
      const playerPieces = placePlayerArmy(defaultPlayerArmy());
      const state = createBattleState(playerPieces, stage.enemyPieces);
      const royal = findRoyal(state, 'enemy');
      expect(royal).toBeDefined();
    }
  });

  it('capturing enemy king in each stage results in victory', () => {
    const stages = buildStages();
    for (const stage of stages) {
      const playerPieces = placePlayerArmy(defaultPlayerArmy());
      const state = createBattleState(playerPieces, stage.enemyPieces);
      const enemyRoyal = findRoyal(state, 'enemy');
      if (!enemyRoyal) continue;
      // Find a player piece that can capture the royal.
      const playerPiece = state.pieces.find((p) => p.side === 'player');
      if (!playerPiece) continue;
      const move = {
        pieceId: playerPiece.id,
        from: playerPiece.position,
        to: enemyRoyal.position,
        capture: enemyRoyal,
      };
      const next = checkBattleEnd(applyMove(state, move));
      expect(next.phase).toBe('victory');
    }
  });
});
