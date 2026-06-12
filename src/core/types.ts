export type Side = 'player' | 'enemy';

export type PieceKind =
  | 'pawn'
  | 'sakuraPawn' // pawn that can also step sideways
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'ninja' // knight moves + 1-square diagonal step
  | 'magicalGirl' // rook moves + survives first capture (barrier)
  | 'queen'
  | 'king';

export interface Pos {
  x: number; // 0..7, file
  y: number; // 0..7, rank; player home rows are y=0..1, enemy y=6..7
}

export interface Piece {
  id: number;
  kind: PieceKind;
  side: Side;
  pos: Pos;
  /** magicalGirl only: absorbs the first capture attempt */
  barrier: boolean;
}

export interface Move {
  pieceId: number;
  from: Pos;
  to: Pos;
  /** id of the piece captured by this move, if any */
  captureId?: number;
  /** true when the capture only popped a barrier (target survives) */
  barrierPopped?: boolean;
  /** pawn promoted to queen on this move */
  promotion?: boolean;
}

export const BOARD_SIZE = 8;

export const PIECE_VALUE: Record<PieceKind, number> = {
  pawn: 1,
  sakuraPawn: 1.5,
  knight: 3,
  bishop: 3,
  rook: 5,
  ninja: 4,
  magicalGirl: 6,
  queen: 9,
  king: 1000,
};

export const PIECE_MOVE: Record<PieceKind, string> = {
  pawn: 'Steps forward, captures diagonally',
  sakuraPawn: 'Pawn moves + sideways steps',
  knight: 'Jumps in an L shape',
  bishop: 'Slides diagonally',
  rook: 'Slides in straight lines',
  ninja: 'Knight jumps + 1-square diagonal step',
  magicalGirl: 'Rook moves + barrier blocks first capture',
  queen: 'Slides any direction',
  king: 'One step any direction — protect her!',
};

export const PIECE_NAME: Record<PieceKind, string> = {
  pawn: 'Schoolgirl Pawn',
  sakuraPawn: 'Sakura Pawn',
  knight: 'Pony Knight',
  bishop: 'Magical Bishop',
  rook: 'Castle Guardian',
  ninja: 'Ninja Knight',
  magicalGirl: 'Magical Girl',
  queen: 'Legendary Queen',
  king: 'Regal King',
};

export function inBounds(p: Pos): boolean {
  return p.x >= 0 && p.x < BOARD_SIZE && p.y >= 0 && p.y < BOARD_SIZE;
}

export function samePos(a: Pos, b: Pos): boolean {
  return a.x === b.x && a.y === b.y;
}
