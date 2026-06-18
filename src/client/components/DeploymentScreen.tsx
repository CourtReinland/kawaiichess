import { useState } from 'react';
import type { AcademyDefinition, Position } from '../../game';
import { PIECE_BY_ID } from '../../game/pieces';
import { CharacterMini } from './CharacterPortrait';

export interface DeployPiece {
  id: string;
  definitionId: string;
  position?: Position;
}

interface DeploymentScreenProps {
  pieces: DeployPiece[];
  onChange: (pieces: DeployPiece[]) => void;
  onStart: () => void;
  stageName: string;
  opponentAcademy: AcademyDefinition;
  playerAcademy: AcademyDefinition;
  theme?: string;
}

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

function positionKey(pos: Position): string {
  return `${pos.x},${pos.y}`;
}

export function DeploymentScreen({ pieces, onChange, onStart, stageName, opponentAcademy, playerAcademy, theme }: DeploymentScreenProps) {
  const [selectedPieceId, setSelectedPieceId] = useState<string | undefined>(undefined);

  const deployed = pieces.filter((p) => p.position);
  const bench = pieces.filter((p) => !p.position);

  function handleBenchClick(piece: DeployPiece) {
    setSelectedPieceId(piece.id);
  }

  function handleBoardClick(pos: Position) {
    if (!selectedPieceId) return;

    const selected = pieces.find((p) => p.id === selectedPieceId);
    if (!selected) return;

    const occupant = deployed.find((p) => p.position && positionKey(p.position) === positionKey(pos));

    const updated = pieces.map((p) => {
      if (p.id === selectedPieceId) {
        return { ...p, position: pos };
      }
      if (occupant && p.id === occupant.id) {
        return { ...p, position: selected.position };
      }
      return p;
    });

    onChange(updated);
    setSelectedPieceId(undefined);
  }

  function handleDeployedClick(piece: DeployPiece) {
    if (selectedPieceId === piece.id) {
      const updated = pieces.map((p) => (p.id === piece.id ? { ...p, position: undefined } : p));
      onChange(updated);
      setSelectedPieceId(undefined);
    } else {
      setSelectedPieceId(piece.id);
    }
  }

  function autoDeploy() {
    const nonPawns = pieces.filter((p) => PIECE_BY_ID[p.definitionId]?.movement !== 'pawn');
    const pawns = pieces.filter((p) => PIECE_BY_ID[p.definitionId]?.movement === 'pawn');
    const ordered = [...nonPawns, ...pawns];
    const updated: DeployPiece[] = [];
    let x = 0;
    let y = 0;
    const used = new Set<string>();
    for (const piece of ordered) {
      while (used.has(`${x},${y}`)) {
        x++;
        if (x >= BOARD_WIDTH) {
          x = 0;
          y++;
        }
      }
      used.add(`${x},${y}`);
      updated.push({ ...piece, position: { x, y } });
      x++;
      if (x >= BOARD_WIDTH) {
        x = 0;
        y++;
      }
    }
    onChange(updated);
  }

  const tiles: Position[] = [];
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      tiles.push({ x, y });
    }
  }

  const themeClass = theme ? `board-theme-${theme.replace(/\./g, '-')}` : '';

  return (
    <div className="overlay-screen">
      <h2>Match Formation 🎀</h2>
      <div className="academy-matchup">
        <div className="academy-matchup-side">
          <img src={`/academies/${playerAcademy.crestImage}`} alt={playerAcademy.name} className="academy-crest" />
          <strong>{playerAcademy.name}</strong>
        </div>
        <span className="vs">VS</span>
        <div className="academy-matchup-side">
          <img src={`/academies/${opponentAcademy.crestImage}`} alt={opponentAcademy.name} className="academy-crest" />
          <strong>{opponentAcademy.name}</strong>
        </div>
      </div>
      <p className="academy-flavor">{opponentAcademy.flavorText}</p>
      <p>
        Arrange your club members for <strong>{stageName}</strong>. Tap a member, then tap a square to place them.
      </p>

      <div className={`board-container ${themeClass}`}>
        <div className="chess-board">
          {tiles.map((pos) => {
            const piece = deployed.find((p) => p.position && positionKey(p.position) === positionKey(pos));
            const light = (pos.x + pos.y) % 2 === 0;
            const isSelected = piece?.id === selectedPieceId;
            return (
              <div
                key={positionKey(pos)}
                className={['board-tile', light ? 'light' : 'dark'].join(' ')}
                onClick={() => handleBoardClick(pos)}
                role="button"
                aria-label={`Deploy square ${String.fromCharCode(97 + pos.x)}${pos.y + 1}`}
              >
                {piece && (
                  <span
                    className={['deploy-piece', isSelected ? 'selected' : ''].join(' ')}
                    title={PIECE_BY_ID[piece.definitionId]?.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeployedClick(piece);
                    }}
                    role="button"
                  >
                    <CharacterMini definition={PIECE_BY_ID[piece.definitionId]} side="player" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="army-roster">
        <h3>Bench</h3>
        <div className="roster-pieces">
          {bench.length === 0 && <span className="roster-piece">All units deployed!</span>}
          {bench.map((piece) => {
            const def = PIECE_BY_ID[piece.definitionId];
            if (!def) return null;
            return (
              <button
                key={piece.id}
                className={`roster-piece ${selectedPieceId === piece.id ? 'selected' : ''}`}
                onClick={() => handleBenchClick(piece)}
                type="button"
              >
                <CharacterMini definition={def} side="player" />
                <span className="roster-piece-name">{def.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="control-bar" style={{ maxWidth: '600px' }}>
        <button className="kawaii-button secondary" onClick={autoDeploy} type="button">
          Auto Deploy
        </button>
        <button className="kawaii-button" onClick={onStart} disabled={bench.length > 0} type="button">
          Start Battle
        </button>
      </div>
    </div>
  );
}
