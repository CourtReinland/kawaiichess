import type { PieceInstance } from '../../game';
import { getDefinition } from '../../game/board';

interface PieceViewProps {
  piece: PieceInstance;
  uniformTheme?: string;
  rotation?: number;
}

export function PieceView({ piece, uniformTheme, rotation = 0 }: PieceViewProps) {
  const def = getDefinition(piece);
  const sideClass = piece.side === 'player' ? 'player' : 'enemy';
  const royalClass = def.isRoyal ? 'royal' : '';
  const uniformClass = uniformTheme ?? '';
  return (
    <span
      className={`piece ${sideClass} ${royalClass} ${uniformClass}`}
      title={def.name}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {def.icon}
    </span>
  );
}
