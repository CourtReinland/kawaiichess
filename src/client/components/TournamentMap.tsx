import { TOURNAMENT_MAP_NODES } from '../../game/tournament-map';
import { getAcademy } from '../../game/academies';

interface TournamentMapProps {
  currentStageIndex: number;
  onSelectNode: (matchIndex: number) => void;
}

export function TournamentMap({ currentStageIndex, onSelectNode }: TournamentMapProps) {
  return (
    <div className="tournament-map">
      <div className="tournament-map-title">National Chess Circuit</div>
      <p className="tournament-map-subtitle">Alishan Academy's road to the Elite Cohort</p>
      <div className="tournament-map-scroll">
        <div className="tournament-map-path">
          <svg className="map-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {TOURNAMENT_MAP_NODES.map((node, idx) => {
              const next = TOURNAMENT_MAP_NODES[idx + 1];
              if (!next) return null;
              const active = idx < currentStageIndex;
              return (
                <line
                  key={`${node.id}-${next.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  className={active ? 'completed' : 'pending'}
                />
              );
            })}
          </svg>
          {TOURNAMENT_MAP_NODES.map((node) => {
            const academy = getAcademy(node.academyId);
            const status =
              node.matchIndex < currentStageIndex
                ? 'completed'
                : node.matchIndex === currentStageIndex
                  ? 'current'
                  : 'locked';
            return (
              <button
                key={node.id}
                className={`map-node ${status}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() =>
                  node.matchIndex >= 0 && status !== 'locked' && onSelectNode(node.matchIndex)
                }
                type="button"
                disabled={status === 'locked'}
              >
                <img src={`/academies/${academy.crestImage}`} alt={academy.name} />
                <span>{academy.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
