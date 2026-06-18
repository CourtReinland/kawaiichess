import { useCallback, useEffect, useState } from 'react';
import type { StoryScene } from '../../game';
import { PIECE_BY_ID } from '../../game';

interface VisualNovelSceneProps {
  scene: StoryScene;
  onDone: () => void;
}

export function VisualNovelScene({ scene, onDone }: VisualNovelSceneProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState('');

  const currentLine = scene.dialogue[lineIndex];
  const isLastLine = lineIndex >= scene.dialogue.length - 1;

  useEffect(() => {
    if (!currentLine) return undefined;
    setIsTyping(true);
    setDisplayText('');
    let i = 0;
    const text = currentLine.text;
    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [lineIndex, currentLine]);

  const advance = useCallback(() => {
    if (isTyping) {
      // Skip to end of current line.
      setDisplayText(currentLine?.text ?? '');
      setIsTyping(false);
      return;
    }
    if (isLastLine) {
      onDone();
    } else {
      setLineIndex((idx) => idx + 1);
    }
  }, [isTyping, isLastLine, currentLine, onDone]);

  if (!currentLine) {
    return null;
  }

  const speakerName = currentLine.speaker;
  const speakerDef = currentLine.speakerPieceId ? PIECE_BY_ID[currentLine.speakerPieceId] : undefined;
  const portraitPath =
    currentLine.portraitImage ??
    (speakerDef?.portraitImage
      ? `/characters/portraits/${speakerDef.portraitImage}`
      : speakerDef
        ? `/characters/portraits/${speakerDef.id}-${currentLine.mood ?? 'neutral'}.png`
        : undefined);

  const leftPortrait = currentLine.position === 'left' ? portraitPath : undefined;
  const rightPortrait = currentLine.position === 'right' ? portraitPath : undefined;
  const centerPortrait = currentLine.position === 'center' ? portraitPath : undefined;

  return (
    <div
      className="visual-novel-scene"
      style={{ backgroundImage: `url(/${scene.backgroundImage})` }}
      onClick={advance}
      role="button"
      aria-label="Story scene"
    >
      <button className="vn-skip" onClick={(e) => { e.stopPropagation(); onDone(); }} type="button">
        Skip
      </button>

      <div className="vn-stage">
        {leftPortrait && (
          <img src={leftPortrait} alt={speakerName} className="vn-portrait left" />
        )}
        {centerPortrait && (
          <img src={centerPortrait} alt={speakerName} className="vn-portrait center" />
        )}
        {rightPortrait && (
          <img src={rightPortrait} alt={speakerName} className="vn-portrait right" />
        )}
      </div>

      <div className="vn-dialogue-box">
        <div className="vn-speaker">{speakerName}</div>
        <div className="vn-text">{displayText}</div>
        {!isTyping && (
          <div className="vn-advance-hint">{isLastLine ? 'Tap to continue' : 'Tap to continue'}</div>
        )}
      </div>
    </div>
  );
}
