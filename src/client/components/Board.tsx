import type { BattleState, Move, PieceInstance, Position, Side } from '../../game';
import { getPieceAt, positionsEqual } from '../../game/board';
import { CharacterMini } from './CharacterPortrait';

interface BoardProps {
  state: BattleState;
  selectedPieceId?: string;
  onSelectPiece: (pieceId: string) => void;
  onMove: (move: Move) => void;
  rotation?: 0 | 180;
  theme?: string;
}

export function Board({ state, selectedPieceId, onSelectPiece, onMove, rotation = 0, theme }: BoardProps) {
  const tiles: Position[] = [];
  for (let y = state.height - 1; y >= 0; y--) {
    for (let x = 0; x < state.width; x++) {
      tiles.push({ x, y });
    }
  }

  const selectedPiece = selectedPieceId
    ? state.pieces.find((p) => p.id === selectedPieceId)
    : undefined;
  const selectedSide: Side | undefined = selectedPiece?.side;

  const selectedMoves = selectedPieceId
    ? state.highlightedMoves.filter((m) => m.pieceId === selectedPieceId)
    : [];

  const getMoveAt = (pos: Position): Move | undefined =>
    selectedMoves.find((m) => positionsEqual(m.to, pos));

  const handleTileClick = (pos: Position) => {
    const piece = getPieceAt(state, pos);
    const move = getMoveAt(pos);

    // Execute a player move only on the player's turn.
    if (move && selectedSide === 'player' && state.turn === 'player') {
      onMove(move);
      return;
    }

    // Select any piece on the board so players can inspect movement ranges.
    if (piece && state.phase === 'battle') {
      onSelectPiece(piece.id);
    } else {
      onSelectPiece('');
    }
  };

  const tileClasses = (pos: Position, piece?: PieceInstance) => {
    const isSelected = piece?.id === selectedPieceId;
    const light = (pos.x + pos.y) % 2 === 0;
    const move = getMoveAt(pos);
    const highlight = Boolean(move);
    const capture = move?.capture;
    const inspectingEnemy = selectedSide === 'enemy';

    return [
      'board-tile',
      light ? 'light' : 'dark',
      isSelected ? 'selected' : '',
      highlight && inspectingEnemy ? (capture ? 'enemy-capture' : 'enemy-range') : '',
      highlight && !inspectingEnemy ? (capture ? 'valid-capture' : 'valid-move') : '',
    ].join(' ');
  };

  const themeClass = theme ? `board-theme-${theme.replace(/\./g, '-')}` : '';

  return (
    <div className={`board-container ${themeClass}`}>
      <div
        className="chess-board"
        style={{ transform: `rotateX(var(--board-tilt)) scale(1.05) rotateZ(${rotation}deg)` }}
      >
        {tiles.map((pos) => {
          const piece = getPieceAt(state, pos);
          return (
            <div
              key={`${pos.x}-${pos.y}`}
              className={tileClasses(pos, piece)}
              onClick={() => handleTileClick(pos)}
              role="button"
              aria-label={`Square ${String.fromCharCode(97 + pos.x)}${pos.y + 1}`}
            >
              {piece && (
                <CharacterMini piece={piece} rotation={-rotation} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
