import type { BattleState, Position, RunState, StageFormation } from './types';
import { PIECE_BY_ID, rollDraftOptions } from './pieces';
import { createBattleState } from './board';

export const MAX_STAGES = 7;

export function defaultPlayerArmy(): string[] {
  return [
    'king',
    'magical-girl-rook',
    'ninja-knight',
    'idol-bishop',
    'schoolgirl-pawn',
    'schoolgirl-pawn',
  ];
}

export function createRunState(): RunState {
  return {
    stageIndex: 0,
    stages: buildStages(),
    playerArmy: defaultPlayerArmy(),
    draftedPieces: [],
    deployments: {},
    gold: 0,
    victories: 0,
    defeats: 0,
    runStartedAt: Date.now(),
  };
}

export function buildStages(): StageFormation[] {
  const stages: StageFormation[] = [
    {
      name: 'Match 1 — Seishin High',
      academyId: 'seishin-high',
      enemyPieces: [
        { definitionId: 'seishin-king', position: { x: 4, y: 7 } },
        { definitionId: 'seishin-bishop', position: { x: 3, y: 6 } },
        { definitionId: 'seishin-bishop', position: { x: 5, y: 6 } },
        { definitionId: 'seishin-pawn', position: { x: 4, y: 5 } },
      ],
      rewardGold: 10,
      difficulty: 2,
    },
    {
      name: 'Match 2 — Candy Forest Prep',
      academyId: 'candy-forest-prep',
      enemyPieces: [
        { definitionId: 'king', position: { x: 4, y: 7 } },
        { definitionId: 'rook', position: { x: 2, y: 7 } },
        { definitionId: 'knight', position: { x: 6, y: 6 } },
        { definitionId: 'pawn', position: { x: 3, y: 5 } },
        { definitionId: 'pawn', position: { x: 5, y: 5 } },
      ],
      rewardGold: 12,
      difficulty: 2,
    },
    {
      name: 'Match 3 — Thunder Samurai Institute',
      academyId: 'thunder-samurai-institute',
      enemyPieces: [
        { definitionId: 'king', position: { x: 4, y: 7 } },
        { definitionId: 'thunder-samurai', position: { x: 3, y: 6 } },
        { definitionId: 'knight', position: { x: 5, y: 6 } },
        { definitionId: 'pawn', position: { x: 2, y: 5 } },
        { definitionId: 'pawn', position: { x: 6, y: 5 } },
      ],
      rewardGold: 15,
      difficulty: 3,
    },
    {
      name: 'Match 4 — Kitsune Illusion Academy',
      academyId: 'kitsune-illusion-academy',
      enemyPieces: [
        { definitionId: 'king', position: { x: 4, y: 7 } },
        { definitionId: 'kitsune-trickster', position: { x: 3, y: 7 } },
        { definitionId: 'bishop', position: { x: 5, y: 6 } },
        { definitionId: 'rook', position: { x: 2, y: 6 } },
        { definitionId: 'pawn', position: { x: 4, y: 5 } },
      ],
      rewardGold: 18,
      difficulty: 3,
    },
    {
      name: 'Match 5 — Celestial Mage Collegium',
      academyId: 'celestial-mage-collegium',
      enemyPieces: [
        { definitionId: 'king', position: { x: 4, y: 7 } },
        { definitionId: 'celestial-mage', position: { x: 3, y: 6 } },
        { definitionId: 'valkyrie-paladin', position: { x: 5, y: 6 } },
        { definitionId: 'knight', position: { x: 2, y: 7 } },
        { definitionId: 'rook', position: { x: 6, y: 7 } },
      ],
      rewardGold: 22,
      difficulty: 4,
    },
    {
      name: 'Match 6 — Final Boss Throne Academy',
      academyId: 'final-boss-throne-academy',
      enemyPieces: [
        { definitionId: 'final-boss-queen', position: { x: 4, y: 7 } },
        { definitionId: 'demon-queen', position: { x: 3, y: 6 } },
        { definitionId: 'void-princess', position: { x: 5, y: 6 } },
        { definitionId: 'knight', position: { x: 2, y: 7 } },
        { definitionId: 'knight', position: { x: 6, y: 7 } },
        { definitionId: 'pawn', position: { x: 3, y: 5 } },
        { definitionId: 'pawn', position: { x: 4, y: 5 } },
        { definitionId: 'pawn', position: { x: 5, y: 5 } },
      ],
      rewardGold: 30,
      difficulty: 5,
    },
    {
      name: 'Match 7 — Yami no Gakuen',
      academyId: 'yami-no-gakuen',
      enemyPieces: [
        { definitionId: 'king', position: { x: 4, y: 7 } },
        { definitionId: 'pawn', position: { x: 3, y: 6 } },
        { definitionId: 'pawn', position: { x: 4, y: 6 } },
        { definitionId: 'knight', position: { x: 2, y: 7 } },
        { definitionId: 'bishop', position: { x: 5, y: 7 } },
        { definitionId: 'rook', position: { x: 6, y: 7 } },
      ],
      rewardGold: 50,
      difficulty: 6,
    },
  ];
  return stages;
}

export function placePlayerArmy(army: string[]): { definitionId: string; position: Position }[] {
  const pieces: { definitionId: string; position: Position }[] = [];
  const usedPositions = new Set<string>();

  // Find the king and place it centrally on the back row.
  const kingIndex = army.findIndex((id) => PIECE_BY_ID[id]?.isRoyal);
  const remaining = [...army];
  if (kingIndex >= 0) {
    const [kingId] = remaining.splice(kingIndex, 1);
    const kingPos = { x: 3, y: 0 };
    usedPositions.add(`${kingPos.x},${kingPos.y}`);
    pieces.push({ definitionId: kingId, position: kingPos });
  }

  // Separate pawns and non-pawns.
  const nonPawns: string[] = [];
  const pawns: string[] = [];
  for (const id of remaining) {
    const def = PIECE_BY_ID[id];
    if (def?.movement === 'pawn') pawns.push(id);
    else nonPawns.push(id);
  }

  // Place non-pawns starting at the back, filling left-to-right then moving forward.
  let x = 0;
  let y = 0;
  for (const id of nonPawns) {
    while (usedPositions.has(`${x},${y}`)) {
      x++;
      if (x >= 8) {
        x = 0;
        y++;
      }
    }
    usedPositions.add(`${x},${y}`);
    pieces.push({ definitionId: id, position: { x, y } });
    x++;
    if (x >= 8) {
      x = 0;
      y++;
    }
  }

  // Place pawns on the row immediately in front of the last non-pawn row.
  const maxNonPawnY = pieces.length > 0 ? Math.max(...pieces.map((p) => p.position.y)) : 0;
  x = 0;
  y = maxNonPawnY + 1;
  for (const id of pawns) {
    while (usedPositions.has(`${x},${y}`)) {
      x++;
      if (x >= 8) {
        x = 0;
        y++;
      }
    }
    usedPositions.add(`${x},${y}`);
    pieces.push({ definitionId: id, position: { x, y } });
    x++;
    if (x >= 8) {
      x = 0;
      y++;
    }
  }

  return pieces;
}

export function startBattle(
  run: RunState,
  customPieces?: { definitionId: string; position: Position }[],
): BattleState {
  const stage = run.stages[run.stageIndex];
  const playerPieces = customPieces ?? placePlayerArmy(run.playerArmy);
  return createBattleState(playerPieces, stage.enemyPieces);
}

export function generateDraft(run: RunState) {
  const nextStageIndex = run.stageIndex + 1;
  return rollDraftOptions(nextStageIndex, run.playerArmy, 3);
}

export function acceptDraft(run: RunState, pieceId: string): RunState {
  return {
    ...run,
    playerArmy: [...run.playerArmy, pieceId],
    draftedPieces: [...run.draftedPieces, pieceId],
  };
}

export function buildDeployPieces(
  run: RunState,
): { id: string; definitionId: string; position?: Position }[] {
  return run.playerArmy.map((definitionId, index) => {
    const id = `${definitionId}-${index}`;
    return {
      id,
      definitionId,
      position: run.deployments[id],
    };
  });
}

export function extractDeployments(
  deployPieces: { id: string; definitionId: string; position?: Position }[],
): Record<string, Position> {
  const deployments: Record<string, Position> = {};
  for (const piece of deployPieces) {
    if (piece.position) {
      deployments[piece.id] = piece.position;
    }
  }
  return deployments;
}

export function advanceStage(run: RunState): RunState {
  const nextIndex = run.stageIndex + 1;
  if (nextIndex >= run.stages.length) {
    return { ...run, stageIndex: nextIndex, victories: run.victories + 1 };
  }
  return {
    ...run,
    stageIndex: nextIndex,
    victories: run.victories + 1,
    gold: run.gold + run.stages[run.stageIndex].rewardGold,
  };
}

export function recordDefeat(run: RunState): RunState {
  return { ...run, defeats: run.defeats + 1 };
}

export function isRunComplete(run: RunState): boolean {
  return run.stageIndex >= run.stages.length;
}

const RUN_STORAGE_KEY = 'kawaiichess-run-v2';

function storageAvailable(): boolean {
  return (
    typeof localStorage !== 'undefined' &&
    typeof localStorage.setItem === 'function' &&
    typeof localStorage.getItem === 'function' &&
    typeof localStorage.removeItem === 'function'
  );
}

export function saveRun(run: RunState): void {
  if (!storageAvailable()) return;
  localStorage.setItem(RUN_STORAGE_KEY, JSON.stringify(run));
}

export function loadRun(): RunState | undefined {
  if (!storageAvailable()) return undefined;
  const raw = localStorage.getItem(RUN_STORAGE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as RunState;
    // Migrate old saves that lacked deployments.
    if (!parsed.deployments) parsed.deployments = {};
    return parsed;
  } catch {
    return undefined;
  }
}

export function clearSavedRun(): void {
  if (!storageAvailable()) return;
  localStorage.removeItem(RUN_STORAGE_KEY);
}
