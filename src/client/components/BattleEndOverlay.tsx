import type { BattleEndScene } from '../../game';

interface BattleEndOverlayProps {
  scene: BattleEndScene;
  isVictory: boolean;
  winnerPortrait?: string;
  loserPortrait?: string;
  onContinue: () => void;
}

export function BattleEndOverlay({
  scene,
  isVictory,
  winnerPortrait,
  loserPortrait,
  onContinue,
}: BattleEndOverlayProps) {
  return (
    <div className={`battle-end-overlay ${isVictory ? 'victory' : 'defeat'}`}>
      <div className="battle-end-banner">{scene.banner}</div>
      <div className="battle-end-actors">
        <div className="battle-end-actor winner">
          {winnerPortrait ? (
            <img src={winnerPortrait} alt="Winner" className="battle-end-portrait" />
          ) : (
            <span className="battle-end-icon">{scene.winnerIcon}</span>
          )}
          <span className="battle-end-label">WINNER</span>
        </div>
        <div className="battle-end-actor loser">
          {loserPortrait ? (
            <img src={loserPortrait} alt="Loser" className="battle-end-portrait" />
          ) : (
            <span className="battle-end-icon">{scene.loserIcon}</span>
          )}
          <span className="battle-end-label">LOSER</span>
        </div>
      </div>
      <div className="battle-end-taunt">
        <p className="winner-line">{scene.winnerLine}</p>
        {scene.loserLine && <p className="loser-line">{scene.loserLine}</p>}
      </div>
      <button className="kawaii-button" onClick={onContinue} type="button">
        Continue
      </button>
    </div>
  );
}
