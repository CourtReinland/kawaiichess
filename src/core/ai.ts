import type { Battle } from './battle';
import { PIECE_VALUE, type Move, type Side } from './types';

/**
 * Minimax with alpha-beta pruning. Evaluates from the enemy's perspective
 * (the AI always plays the 'enemy' side).
 */

const ADVANCE_WEIGHT = 0.04;

function evaluate(battle: Battle): number {
  let score = 0;
  for (const p of battle.pieces) {
    const sign = p.side === 'enemy' ? 1 : -1;
    score += sign * PIECE_VALUE[p.kind];
    // reward advancing toward the opponent (enemy moves toward y=0)
    const advance = p.side === 'enemy' ? 7 - p.pos.y : p.pos.y;
    if (p.kind !== 'king') score += sign * ADVANCE_WEIGHT * advance;
    if (p.kind === 'magicalGirl' && p.barrier) score += sign * 1.5;
  }
  return score;
}

function orderedMoves(battle: Battle, side: Side): Move[] {
  const moves = battle.allMoves(side);
  // captures first, biggest victim first — much better pruning
  return moves.sort((a, b) => {
    const va = a.captureId ? PIECE_VALUE[battle.pieceById(a.captureId)!.kind] : -1;
    const vb = b.captureId ? PIECE_VALUE[battle.pieceById(b.captureId)!.kind] : -1;
    return vb - va;
  });
}

function minimax(
  battle: Battle,
  depth: number,
  alpha: number,
  beta: number,
  side: Side,
): number {
  const winner = battle.fallenKingWinner(); // cheap: no move generation
  if (winner === 'enemy') return 100000 + depth; // prefer faster wins
  if (winner === 'player') return -100000 - depth;
  if (depth === 0) return evaluate(battle);

  const moves = orderedMoves(battle, side);
  if (side === 'enemy') {
    let best = -Infinity;
    for (const move of moves) {
      const undo = battle.apply(move);
      best = Math.max(best, minimax(battle, depth - 1, alpha, beta, 'player'));
      undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const undo = battle.apply(move);
      best = Math.min(best, minimax(battle, depth - 1, alpha, beta, 'enemy'));
      undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function chooseEnemyMove(battle: Battle, depth = 3): Move | undefined {
  const moves = orderedMoves(battle, 'enemy');
  if (moves.length === 0) return undefined;
  let bestScore = -Infinity;
  let best: Move[] = [];
  for (const move of moves) {
    const undo = battle.apply(move);
    const score = minimax(battle, depth - 1, -Infinity, Infinity, 'player');
    undo();
    if (score > bestScore + 1e-9) {
      bestScore = score;
      best = [move];
    } else if (Math.abs(score - bestScore) < 1e-9) {
      best.push(move); // collect ties, pick randomly for variety
    }
  }
  return best[Math.floor(Math.random() * best.length)];
}
