import type { PieceInstance, PieceDefinition } from '../../game';
import { getDefinition, PIECE_BY_ID } from '../../game';

interface CharacterPortraitProps {
  piece?: PieceInstance;
  definition?: PieceDefinition;
  speakerName?: string;
  mood?: 'neutral' | 'angry' | 'happy' | 'surprised' | 'flirty';
  position?: 'left' | 'right' | 'center';
  isActive?: boolean;
}

export function CharacterPortrait({
  piece,
  definition,
  speakerName,
  mood = 'neutral',
  position = 'center',
  isActive = true,
}: CharacterPortraitProps) {
  const def = definition ?? (piece ? getDefinition(piece) : undefined);
  const name = speakerName ?? def?.name ?? '???';
  const icon = def?.icon ?? '❓';

  // Build portrait path from piece id and mood if available; otherwise use the definition's portraitImage.
  const pieceId = piece?.definitionId ?? def?.id;
  const portraitPath = pieceId
    ? `/characters/portraits/${def?.portraitImage ?? `${pieceId}-${mood}.png`}`
    : undefined;

  const positionClass = `portrait-${position}`;
  const activeClass = isActive ? 'active' : 'dimmed';

  return (
    <div className={`character-portrait ${positionClass} ${activeClass}`}>
      {portraitPath ? (
        <img src={portraitPath} alt={name} className="portrait-image" />
      ) : (
        <span className="portrait-fallback">{icon}</span>
      )}
      <span className="portrait-name">{name}</span>
    </div>
  );
}

interface CharacterMiniProps {
  piece?: PieceInstance;
  definition?: PieceDefinition;
  side?: 'player' | 'enemy';
  rotation?: number;
}

export function CharacterMini({ piece, definition, side, rotation = 0 }: CharacterMiniProps) {
  const def = piece ? getDefinition(piece) : definition;
  const miniSide = piece ? piece.side : side ?? 'player';
  if (!def) return null;
  const miniPath = def.miniImage
    ? `/characters/minis/${def.miniImage}`
    : undefined;

  return (
    <span
      className={`character-mini ${miniSide} ${def.isRoyal ? 'royal' : ''}`}
      title={def.name}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {miniPath ? (
        <img src={miniPath} alt={def.name} />
      ) : (
        <span className="mini-fallback">{def.icon}</span>
      )}
    </span>
  );
}

export function getSpeakerPortrait(speakerPieceId?: string, mood?: CharacterPortraitProps['mood']): string | undefined {
  if (!speakerPieceId) return undefined;
  const def = PIECE_BY_ID[speakerPieceId];
  if (!def) return undefined;
  if (def.portraitImage) return `/characters/portraits/${def.portraitImage}`;
  return `/characters/portraits/${speakerPieceId}-${mood ?? 'neutral'}.png`;
}
