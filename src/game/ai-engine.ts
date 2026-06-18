import type { BattleState, Move, PieceInstance, Position, Side } from './types';
import {
  applyMove,
  checkBattleEnd,
  findRoyal,
  getDefinition,
  getValidMoves,
  isEnemy,
  switchTurn,
} from './board';

const PIECE_VALUES: Record<string, number> = {
  king: 20000,
  queen: 900,
  rook: 500,
  bishop: 330,
  knight: 320,
  pawn: 100,
};

function getPieceValue(piece: PieceInstance): number {
  const def = getDefinition(piece);
  if (def.isRoyal) return PIECE_VALUES.king;
  const base = PIECE_VALUES[def.id] ?? PIECE_VALUES[def.movement] ?? 300;
  // Tier bonus on top of movement value.
  const tierBonus = def.tier === 3 ? 150 : def.tier === 2 ? 75 : 0;
  return base + tierBonus;
}

function distance(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function countMoves(state: BattleState, side: Side): number {
  let count = 0;
  for (const piece of state.pieces) {
    if (piece.side !== side) continue;
    count += getValidMoves(state, piece.id).length;
  }
  return count;
}

function evaluate(state: BattleState): number {
  // Evaluation is from the enemy (maximizing) side's perspective.
  // 'defeat' means the player lost -> enemy won.
  // 'victory' means the player won -> enemy lost.
  if (state.phase === 'defeat') return Infinity;
  if (state.phase === 'victory') return -Infinity;

  let score = 0;
  const playerRoyal = findRoyal(state, 'player');
  const enemyRoyal = findRoyal(state, 'enemy');
  const center = { x: 3.5, y: 3.5 };

  for (const piece of state.pieces) {
    const value = getPieceValue(piece);
    const sign = piece.side === 'enemy' ? 1 : -1;
    score += sign * value;

    // Positional bonus: closer to center and closer to enemy king.
    const toCenter = 7 - distance(piece.position, center);
    score += sign * toCenter * 2;

    if (piece.side === 'enemy' && playerRoyal) {
      const advance = 7 - distance(piece.position, playerRoyal.position);
      score += advance * 4;

      // Big bonus for threatening the player royal (check / mate pressure).
      const canCheck = getValidMoves(state, piece.id).some(
        (m) => m.capture && m.capture.id === playerRoyal.id,
      );
      if (canCheck) score += value * 0.4;
    } else if (piece.side === 'player' && enemyRoyal) {
      const advance = 7 - distance(piece.position, enemyRoyal.position);
      score -= advance * 4;
    }
  }

  // King safety: keep enemy king away from player king, player king safe.
  if (playerRoyal && enemyRoyal) {
    const kingSeparation = distance(playerRoyal.position, enemyRoyal.position);
    // Enemy prefers smaller separation (pressure); player prefers larger.
    score += (14 - kingSeparation) * 5;
  }

  // Mobility: the side with more options is harder to pin down.
  const enemyMoves = countMoves(state, 'enemy');
  const playerMoves = countMoves(state, 'player');
  score += (enemyMoves - playerMoves) * 4;

  return score;
}

function getAllMoves(state: BattleState, side: Side): Move[] {
  const moves: Move[] = [];
  for (const piece of state.pieces) {
    if (piece.side !== side) continue;
    moves.push(...getValidMoves(state, piece.id));
  }
  return moves;
}

export function hasAnyValidMoves(state: BattleState, side: Side): boolean {
  for (const piece of state.pieces) {
    if (piece.side !== side) continue;
    if (getValidMoves(state, piece.id).length > 0) return true;
  }
  return false;
}

function minimax(
  state: BattleState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  const ended = checkBattleEnd(state);
  if (ended.phase !== 'battle') {
    return evaluate(ended);
  }
  if (depth === 0) {
    return evaluate(state);
  }

  const side = maximizing ? 'enemy' : 'player';
  const moves = getAllMoves(state, side);
  if (moves.length === 0) {
    // No legal moves: pass turn.
    return minimax(switchTurn(state), depth, alpha, beta, !maximizing);
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const next = checkBattleEnd(switchTurn(applyMove(state, move)));
      const evalScore = minimax(next, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const next = checkBattleEnd(switchTurn(applyMove(state, move)));
      const evalScore = minimax(next, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function generateEnemyMove(state: BattleState, difficulty = 2): Move | null | undefined {
  if (state.phase !== 'battle' || state.turn !== 'enemy') return undefined;

  const enemyPieces = state.pieces.filter((p) => p.side === 'enemy');
  if (enemyPieces.length === 0) return undefined;

  // Difficulty maps directly to search depth, capped to keep mobile turns snappy.
  const depth = Math.min(Math.max(1, difficulty), 4);

  let bestMove: Move | undefined;
  let bestScore = -Infinity;

  for (const piece of enemyPieces) {
    const moves = getValidMoves(state, piece.id);
    for (const move of moves) {
      if (move.capture && !isEnemy(piece, move.capture)) continue;

      const next = checkBattleEnd(switchTurn(applyMove(state, move)));
      const score = minimax(next, depth - 1, -Infinity, Infinity, false);

      // Tie-break: prefer captures and a tiny bit of randomness for variety.
      const captureBonus = move.capture ? getPieceValue(move.capture) * 10 : 0;
      const jitter = Math.random() * 0.3;
      const finalScore = score + captureBonus + jitter;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMove = move;
      }
    }
  }

  // null = the enemy truly has no legal moves (stalemate).
  // undefined = invalid state/turn, caller should not act.
  return bestMove ?? null;
}

export { evaluate, getPieceValue };
