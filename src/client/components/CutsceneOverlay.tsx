import { useEffect } from 'react';
import type { CaptureScene } from '../../game';

interface CutsceneOverlayProps {
  scene: CaptureScene;
  attackerIcon: string;
  defenderIcon: string;
  attackerName: string;
  defenderName: string;
  attackerPortrait?: string;
  defenderPortrait?: string;
  onDone: () => void;
}

export function CutsceneOverlay({
  scene,
  attackerIcon,
  defenderIcon,
  attackerName,
  defenderName,
  attackerPortrait,
  defenderPortrait,
  onDone,
}: CutsceneOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="cutscene-overlay" onClick={onDone} role="button" aria-label="Skip cutscene">
      <div className={`cutscene-effect ${scene.animation}`} />
      <div className="cutscene-actors">
        <div className="cutscene-actor attacker">
          {attackerPortrait ? (
            <img src={attackerPortrait} alt={attackerName} className="cutscene-portrait" />
          ) : (
            <span className="cutscene-icon">{attackerIcon}</span>
          )}
          <span className="cutscene-name">{attackerName}</span>
        </div>
        <div className="cutscene-vs">VS</div>
        <div className="cutscene-actor defender">
          {defenderPortrait ? (
            <img src={defenderPortrait} alt={defenderName} className="cutscene-portrait" />
          ) : (
            <span className="cutscene-icon">{defenderIcon}</span>
          )}
          <span className="cutscene-name">{defenderName}</span>
        </div>
      </div>
      <div className="cutscene-dialogue">
        <p className="attacker-line">{scene.attackerLine}</p>
        {scene.defenderLine && <p className="defender-line">{scene.defenderLine}</p>}
      </div>
      <button className="cutscene-skip" onClick={onDone} type="button">
        Skip ▶
      </button>
    </div>
  );
}
