import type { TournamentMapNode } from './types';

export const TOURNAMENT_MAP_NODES: TournamentMapNode[] = [
  { id: 'alishan', academyId: 'alishan', x: 10, y: 85, matchIndex: -1, connectsTo: 'seishin-high' },
  {
    id: 'seishin-high',
    academyId: 'seishin-high',
    x: 22,
    y: 72,
    matchIndex: 0,
    connectsTo: 'candy-forest-prep',
  },
  {
    id: 'candy-forest-prep',
    academyId: 'candy-forest-prep',
    x: 36,
    y: 62,
    matchIndex: 1,
    connectsTo: 'thunder-samurai-institute',
  },
  {
    id: 'thunder-samurai-institute',
    academyId: 'thunder-samurai-institute',
    x: 50,
    y: 52,
    matchIndex: 2,
    connectsTo: 'kitsune-illusion-academy',
  },
  {
    id: 'kitsune-illusion-academy',
    academyId: 'kitsune-illusion-academy',
    x: 64,
    y: 40,
    matchIndex: 3,
    connectsTo: 'celestial-mage-collegium',
  },
  {
    id: 'celestial-mage-collegium',
    academyId: 'celestial-mage-collegium',
    x: 76,
    y: 28,
    matchIndex: 4,
    connectsTo: 'final-boss-throne-academy',
  },
  {
    id: 'final-boss-throne-academy',
    academyId: 'final-boss-throne-academy',
    x: 86,
    y: 16,
    matchIndex: 5,
    connectsTo: 'yami-no-gakuen',
  },
  { id: 'yami-no-gakuen', academyId: 'yami-no-gakuen', x: 94, y: 6, matchIndex: 6 },
];

export function getCurrentMapNode(stageIndex: number): TournamentMapNode | undefined {
  return TOURNAMENT_MAP_NODES.find((n) => n.matchIndex === stageIndex);
}

export function getMapPathProgress(stageIndex: number): number {
  const node = getCurrentMapNode(stageIndex);
  if (!node) return 100;
  return node.x;
}
