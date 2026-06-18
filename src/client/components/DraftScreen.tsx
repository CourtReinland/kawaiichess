import type { AcademyDefinition, PieceDefinition } from '../../game';

interface DraftScreenProps {
  options: PieceDefinition[];
  onSelect: (pieceId: string) => void;
  onSkip: () => void;
  stageName: string;
  playerAcademy: AcademyDefinition;
}

export function DraftScreen({
  options,
  onSelect,
  onSkip,
  stageName,
  playerAcademy,
}: DraftScreenProps) {
  return (
    <div className="overlay-screen">
      <h2>Match Won! 🌸</h2>
      <div className="academy-matchup">
        <div className="academy-matchup-side">
          <img
            src={`/academies/${playerAcademy.crestImage}`}
            alt={playerAcademy.name}
            className="academy-crest"
          />
          <strong>{playerAcademy.name}</strong>
        </div>
      </div>
      <p>
        You cleared <strong>{stageName}</strong>. A new transfer student wants to join your chess
        club:
      </p>
      <div className="draft-options">
        {options.map((piece) => (
          <button
            key={piece.id}
            className="draft-card"
            onClick={() => onSelect(piece.id)}
            type="button"
          >
            {piece.portraitImage ? (
              <img
                src={`/characters/portraits/${piece.portraitImage}`}
                alt={piece.name}
                className="draft-portrait"
              />
            ) : (
              <div className="icon">{piece.icon}</div>
            )}
            <h3>{piece.name}</h3>
            <div className="tier">
              Tier {piece.tier} • {piece.category}
            </div>
            {piece.personality && <p className="personality">{piece.personality}</p>}
            {piece.flavorQuote && <p className="quote">{piece.flavorQuote}</p>}
            <p>{piece.movement} movement</p>
            {piece.ability && <p>Ability: {piece.ability.name}</p>}
          </button>
        ))}
      </div>
      <div className="control-bar" style={{ marginTop: '24px' }}>
        <button className="kawaii-button secondary" onClick={onSkip} type="button">
          Skip Draft
        </button>
      </div>
    </div>
  );
}
