import type { BattleState, Move, PieceDefinition, PieceInstance, Position, Side } from './types';
import { PIECE_BY_ID } from './pieces';

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

export function createPieceId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function isValidPosition(pos: Position): boolean {
  return pos.x >= 0 && pos.x < BOARD_WIDTH && pos.y >= 0 && pos.y < BOARD_HEIGHT;
}

export function getPieceAt(state: BattleState, pos: Position): PieceInstance | undefined {
  if (!isValidPosition(pos)) return undefined;
  return state.pieces.find((p) => p.position.x === pos.x && p.position.y === pos.y);
}

export function getDefinition(piece: PieceInstance): PieceDefinition {
  return PIECE_BY_ID[piece.definitionId];
}

export function isEnemy(a: PieceInstance, b: PieceInstance): boolean {
  return a.side !== b.side;
}

export function findRoyal(state: BattleState, side: Side): PieceInstance | undefined {
  return state.pieces.find((p) => {
    const def = getDefinition(p);
    return p.side === side && def.isRoyal;
  });
}

function addDirectionMoves(
  moves: Move[],
  state: BattleState,
  piece: PieceInstance,
  dx: number,
  dy: number,
  maxSteps: number,
  canJump: boolean,
): void {
  const from = piece.position;
  for (let step = 1; step <= maxSteps; step++) {
    const to = { x: from.x + dx * step, y: from.y + dy * step };
    if (!isValidPosition(to)) break;
    const target = getPieceAt(state, to);
    if (!target) {
      moves.push({ pieceId: piece.id, from, to });
    } else if (isEnemy(piece, target)) {
      moves.push({ pieceId: piece.id, from, to, capture: target });
      if (!canJump) break;
    } else {
      // Friendly piece: can only continue if this piece can jump/fly over pieces.
      if (!canJump) break;
    }
  }
}

function slidingDirections(movement: 'rook' | 'bishop' | 'queen'): Array<[number, number]> {
  switch (movement) {
    case 'rook':
      return [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
    case 'bishop':
      return [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
    case 'queen':
      return [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
  }
}

function generateSlidingMoves(
  state: BattleState,
  piece: PieceInstance,
  directions: Array<[number, number]>,
  range: number,
  canJump: boolean,
): Move[] {
  const moves: Move[] = [];
  for (const [dx, dy] of directions) {
    addDirectionMoves(moves, state, piece, dx, dy, range, canJump);
  }
  return moves;
}

function generateKnightMoves(state: BattleState, piece: PieceInstance, extended = false): Move[] {
  const deltas = extended
    ? [
        [1, 3],
        [3, 1],
        [-1, 3],
        [-3, 1],
        [1, -3],
        [3, -1],
        [-1, -3],
        [-3, -1],
      ]
    : [
        [1, 2],
        [2, 1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [2, -1],
        [-1, -2],
        [-2, -1],
      ];
  const moves: Move[] = [];
  for (const [dx, dy] of deltas) {
    const to = { x: piece.position.x + dx, y: piece.position.y + dy };
    if (!isValidPosition(to)) continue;
    const target = getPieceAt(state, to);
    if (!target || isEnemy(piece, target)) {
      moves.push({ pieceId: piece.id, from: piece.position, to, capture: target });
    }
  }
  return moves;
}

function generateKingMoves(
  state: BattleState,
  piece: PieceInstance,
  range = 1,
  _canJump = false,
): Move[] {
  const moves: Move[] = [];
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (dx === 0 && dy === 0) continue;
      const to = { x: piece.position.x + dx, y: piece.position.y + dy };
      if (!isValidPosition(to)) continue;
      const target = getPieceAt(state, to);
      if (!target || isEnemy(piece, target)) {
        moves.push({ pieceId: piece.id, from: piece.position, to, capture: target });
      }
    }
  }
  return moves;
}

function generatePawnMoves(state: BattleState, piece: PieceInstance): Move[] {
  const moves: Move[] = [];
  const forward = piece.side === 'player' ? 1 : -1;
  const from = piece.position;

  // Forward move
  const oneForward = { x: from.x, y: from.y + forward };
  if (isValidPosition(oneForward) && !getPieceAt(state, oneForward)) {
    moves.push({ pieceId: piece.id, from, to: oneForward });
    // Initial two-step
    const startingRank = piece.side === 'player' ? 1 : BOARD_HEIGHT - 2;
    if (from.y === startingRank && !piece.hasMoved) {
      const twoForward = { x: from.x, y: from.y + forward * 2 };
      if (!getPieceAt(state, twoForward)) {
        moves.push({ pieceId: piece.id, from, to: twoForward });
      }
    }
  }

  // Diagonal captures
  for (const dx of [-1, 1]) {
    const diag = { x: from.x + dx, y: from.y + forward };
    if (!isValidPosition(diag)) continue;
    const target = getPieceAt(state, diag);
    if (target && isEnemy(piece, target)) {
      moves.push({ pieceId: piece.id, from, to: diag, capture: target });
    }
  }

  return moves;
}

function generateDragonMoves(state: BattleState, piece: PieceInstance): Move[] {
  // King movement plus the ability to jump pieces (simplified as queen-lite with jump).
  const directions = slidingDirections('queen');
  return generateSlidingMoves(state, piece, directions, 4, true);
}

export function getValidMoves(state: BattleState, pieceId: string): Move[] {
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) return [];
  const def = getDefinition(piece);

  let moves: Move[] = [];
  switch (def.movement) {
    case 'king':
      moves = generateKingMoves(state, piece, 1);
      break;
    case 'queen':
      moves = generateSlidingMoves(state, piece, slidingDirections('queen'), BOARD_WIDTH, false);
      break;
    case 'rook':
      moves = generateSlidingMoves(state, piece, slidingDirections('rook'), BOARD_WIDTH, false);
      break;
    case 'bishop':
      moves = generateSlidingMoves(state, piece, slidingDirections('bishop'), BOARD_WIDTH, false);
      break;
    case 'bishop-range':
      moves = generateSlidingMoves(
        state,
        piece,
        slidingDirections('bishop'),
        def.range ?? 4,
        false,
      );
      break;
    case 'knight':
      moves = generateKnightMoves(state, piece);
      break;
    case 'extended-knight':
      moves = generateKnightMoves(state, piece, true);
      break;
    case 'pawn':
      moves = generatePawnMoves(state, piece);
      break;
    case 'short-rook':
      moves = generateSlidingMoves(state, piece, slidingDirections('rook'), def.range ?? 3, false);
      break;
    case 'short-queen':
      moves = generateSlidingMoves(state, piece, slidingDirections('queen'), def.range ?? 4, false);
      break;
    case 'dragon':
      moves = generateDragonMoves(state, piece);
      break;
    case 'jump-king':
      moves = generateKingMoves(state, piece, def.range ?? 2, true);
      break;
    case 'king-plus-one':
      moves = generateKingMoves(state, piece, 2);
      break;
  }

  return moves.filter((m) => !positionsEqual(m.from, m.to));
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function algebraic(pos: Position): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + pos.x);
  const rank = pos.y + 1;
  return `${file}${rank}`;
}

export function checkBattleEnd(state: BattleState): BattleState {
  const playerRoyal = findRoyal(state, 'player');
  const enemyRoyal = findRoyal(state, 'enemy');
  if (!playerRoyal) {
    return { ...state, phase: 'defeat' };
  }
  if (!enemyRoyal) {
    return { ...state, phase: 'victory' };
  }
  return state;
}

export function applyMove(state: BattleState, move: Move): BattleState {
  const mover = state.pieces.find((p) => p.id === move.pieceId);
  if (!mover) return state;

  const def = getDefinition(mover);

  let pieces = state.pieces.filter((p) => !move.capture || p.id !== move.capture.id);

  const promoted =
    def.movement === 'pawn' &&
    ((mover.side === 'player' && move.to.y === BOARD_HEIGHT - 1) ||
      (mover.side === 'enemy' && move.to.y === 0));

  pieces = pieces.map((p) => {
    if (p.id !== mover.id) return p;
    if (def.movement === 'pawn' && promoted) {
      return {
        ...p,
        definitionId: def.promotionTarget ?? 'queen',
        position: { ...move.to },
        hasMoved: true,
        promoted: false,
      };
    }
    return {
      ...p,
      position: { ...move.to },
      hasMoved: true,
    };
  });

  return {
    ...state,
    pieces,
    lastMove: move,
    log: [...state.log, `${def.name} moved to ${algebraic(move.to)}`],
  };
}

export function createBattleState(
  playerPieces: { definitionId: string; position: Position }[],
  enemyPieces: { definitionId: string; position: Position }[],
): BattleState {
  const pieces: PieceInstance[] = [
    ...playerPieces.map((p) => ({
      id: createPieceId(),
      definitionId: p.definitionId,
      side: 'player' as Side,
      position: { ...p.position },
      abilityUsesLeft: PIECE_BY_ID[p.definitionId].ability?.uses,
    })),
    ...enemyPieces.map((p) => ({
      id: createPieceId(),
      definitionId: p.definitionId,
      side: 'enemy' as Side,
      position: { ...p.position },
      abilityUsesLeft: PIECE_BY_ID[p.definitionId].ability?.uses,
    })),
  ];
  return {
    pieces,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    turn: 'player',
    phase: 'battle',
    highlightedMoves: [],
    log: ['Battle started!'],
  };
}

export function switchTurn(state: BattleState): BattleState {
  return { ...state, turn: state.turn === 'player' ? 'enemy' : 'player' };
}
