import {
  BOARD_SIZE,
  inBounds,
  samePos,
  type Move,
  type Piece,
  type PieceKind,
  type Pos,
  type Side,
} from './types';

/**
 * Pure battle state: pieces on an 8x8 board, alternating turns.
 * Win by capturing the opposing king. No check/checkmate rules.
 */
export class Battle {
  pieces: Piece[] = [];
  turn: Side = 'player';
  private nextId = 1;

  spawn(kind: PieceKind, side: Side, pos: Pos): Piece {
    const piece: Piece = {
      id: this.nextId++,
      kind,
      side,
      pos: { ...pos },
      barrier: kind === 'magicalGirl',
    };
    this.pieces.push(piece);
    return piece;
  }

  pieceAt(pos: Pos): Piece | undefined {
    return this.pieces.find((p) => samePos(p.pos, pos));
  }

  pieceById(id: number): Piece | undefined {
    return this.pieces.find((p) => p.id === id);
  }

  /** All legal destination squares for one piece. */
  movesFor(piece: Piece): Pos[] {
    const dir = piece.side === 'player' ? 1 : -1; // pawns advance toward the enemy
    const out: Pos[] = [];
    const push = (pos: Pos, canCapture = true, mustCapture = false) => {
      if (!inBounds(pos)) return false;
      const occupant = this.pieceAt(pos);
      if (occupant) {
        if (canCapture && occupant.side !== piece.side && !mustCapture) out.push(pos);
        if (mustCapture && occupant.side !== piece.side) out.push(pos);
        return false; // square occupied — sliders stop here
      }
      if (!mustCapture) out.push(pos);
      return true; // empty — sliders continue
    };
    const slide = (dx: number, dy: number) => {
      let p = { x: piece.pos.x + dx, y: piece.pos.y + dy };
      while (push(p)) p = { x: p.x + dx, y: p.y + dy };
    };
    const { x, y } = piece.pos;

    switch (piece.kind) {
      case 'pawn':
      case 'sakuraPawn': {
        push({ x, y: y + dir }, false); // forward, never captures
        push({ x: x - 1, y: y + dir }, true, true); // diagonal capture only
        push({ x: x + 1, y: y + dir }, true, true);
        if (piece.kind === 'sakuraPawn') {
          push({ x: x - 1, y }, false); // sideways drift, never captures
          push({ x: x + 1, y }, false);
        }
        break;
      }
      case 'knight':
      case 'ninja': {
        for (const [dx, dy] of [
          [1, 2], [2, 1], [2, -1], [1, -2],
          [-1, -2], [-2, -1], [-2, 1], [-1, 2],
        ]) {
          push({ x: x + dx, y: y + dy });
        }
        if (piece.kind === 'ninja') {
          // shadow step: one square diagonally in any direction
          for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            push({ x: x + dx, y: y + dy });
          }
        }
        break;
      }
      case 'bishop':
        slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1);
        break;
      case 'rook':
      case 'magicalGirl':
        slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1);
        break;
      case 'queen':
        slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1);
        slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1);
        break;
      case 'king':
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx || dy) push({ x: x + dx, y: y + dy });
          }
        }
        break;
    }
    return out;
  }

  allMoves(side: Side): Move[] {
    const out: Move[] = [];
    for (const piece of this.pieces) {
      if (piece.side !== side) continue;
      for (const to of this.movesFor(piece)) {
        const target = this.pieceAt(to);
        out.push({
          pieceId: piece.id,
          from: { ...piece.pos },
          to,
          captureId: target?.id,
          barrierPopped: target?.barrier ?? false,
          promotion: this.wouldPromote(piece, to),
        });
      }
    }
    return out;
  }

  private wouldPromote(piece: Piece, to: Pos): boolean {
    if (piece.kind !== 'pawn' && piece.kind !== 'sakuraPawn') return false;
    return piece.side === 'player' ? to.y === BOARD_SIZE - 1 : to.y === 0;
  }

  /** Applies a move and returns an undo closure (used by the AI search). */
  apply(move: Move): () => void {
    const piece = this.pieceById(move.pieceId)!;
    const target = move.captureId ? this.pieceById(move.captureId) : undefined;
    const prevPos = { ...piece.pos };
    const prevKind = piece.kind;
    const targetHadBarrier = target?.barrier ?? false;
    let removedIndex = -1;

    if (target) {
      if (target.barrier) {
        target.barrier = false; // barrier absorbs the hit; attacker stays put
        this.turn = this.turn === 'player' ? 'enemy' : 'player';
        return () => {
          target.barrier = true;
          this.turn = this.turn === 'player' ? 'enemy' : 'player';
        };
      }
      removedIndex = this.pieces.indexOf(target);
      this.pieces.splice(removedIndex, 1);
    }
    piece.pos = { ...move.to };
    if (move.promotion) piece.kind = 'queen';
    this.turn = this.turn === 'player' ? 'enemy' : 'player';

    return () => {
      piece.pos = prevPos;
      piece.kind = prevKind;
      if (target && removedIndex >= 0) {
        target.barrier = targetHadBarrier;
        this.pieces.splice(removedIndex, 0, target);
      }
      this.turn = this.turn === 'player' ? 'enemy' : 'player';
    };
  }

  /** Cheap terminal test for AI search: did a king die? */
  fallenKingWinner(): Side | undefined {
    let playerKing = false;
    let enemyKing = false;
    for (const p of this.pieces) {
      if (p.kind !== 'king') continue;
      if (p.side === 'player') playerKing = true;
      else enemyKing = true;
    }
    if (!playerKing) return 'enemy';
    if (!enemyKing) return 'player';
    return undefined;
  }

  /** 'player' | 'enemy' if that side has won, undefined while in progress. */
  winner(): Side | undefined {
    const playerKing = this.pieces.some((p) => p.side === 'player' && p.kind === 'king');
    const enemyKing = this.pieces.some((p) => p.side === 'enemy' && p.kind === 'king');
    if (!playerKing) return 'enemy';
    if (!enemyKing) return 'player';
    // a side with no moves at all loses (extremely rare without check rules)
    if (this.allMoves(this.turn).length === 0) {
      return this.turn === 'player' ? 'enemy' : 'player';
    }
    return undefined;
  }
}
