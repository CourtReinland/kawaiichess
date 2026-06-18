import { useEffect, useRef, useState } from 'react';
import type { CaptureScene } from '../../game';

interface CaptureFinisherProps {
  scene: CaptureScene;
  attackerName: string;
  defenderName: string;
  attackerPortrait?: string;
  defenderPortrait?: string;
  attackerIcon: string;
  defenderIcon: string;
  videoPath?: string;
  onDone: () => void;
}

export function CaptureFinisher({
  scene,
  attackerName,
  defenderName,
  attackerPortrait,
  defenderPortrait,
  attackerIcon,
  defenderIcon,
  videoPath,
  onDone,
}: CaptureFinisherProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoPath) return undefined;
    const handleEnded = () => onDone();
    const handleError = () => setVideoFailed(true);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.play().catch(() => setVideoFailed(true));
    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [videoPath, onDone]);

  if (videoPath && !videoFailed) {
    return (
      <div
        className="capture-finisher video"
        onClick={onDone}
        role="button"
        aria-label="Capture video"
      >
        <video ref={videoRef} src={videoPath} muted playsInline className="capture-video" />
        <div className="capture-video-skip">Tap to skip</div>
      </div>
    );
  }

  return (
    <div
      className={`capture-finisher anim-${scene.animation}`}
      onClick={onDone}
      role="button"
      aria-label="Finishing move"
    >
      <div className="finisher-bg" />
      <div className="finisher-impact" />
      <div className="finisher-arena">
        <div className="finisher-defender">
          {defenderPortrait ? (
            <img src={defenderPortrait} alt={defenderName} />
          ) : (
            <span className="finisher-fallback">{defenderIcon}</span>
          )}
          <span className="finisher-label">{defenderName}</span>
        </div>
        <div className="finisher-attacker">
          {attackerPortrait ? (
            <img src={attackerPortrait} alt={attackerName} />
          ) : (
            <span className="finisher-fallback">{attackerIcon}</span>
          )}
          <span className="finisher-label">{attackerName}</span>
        </div>
      </div>
      <div className="finisher-lines">
        <p className="finisher-attacker-line">{scene.attackerLine}</p>
        {scene.defenderLine && <p className="finisher-defender-line">{scene.defenderLine}</p>}
      </div>
      <div className="finisher-banner">CAPTURED!</div>
    </div>
  );
}
