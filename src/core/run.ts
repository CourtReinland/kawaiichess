import type { PieceKind } from './types';

/**
 * Roguelike run state: a branching node map, a persistent army, and gold.
 * Survives across battles; lost when the king falls.
 */

export type NodeType = 'battle' | 'elite' | 'shop' | 'boss';

export interface MapNode {
  layer: number;
  index: number; // position within the layer
  type: NodeType;
}

export interface ShopOffer {
  kind: PieceKind;
  price: number;
}

export const SHOP_PRICES: Partial<Record<PieceKind, number>> = {
  pawn: 4,
  sakuraPawn: 6,
  knight: 8,
  bishop: 8,
  rook: 12,
  ninja: 14,
  magicalGirl: 16,
  queen: 24,
};

const SHOP_POOL: PieceKind[] = [
  'pawn', 'pawn', 'sakuraPawn', 'knight', 'knight',
  'bishop', 'bishop', 'rook', 'ninja', 'magicalGirl', 'queen',
];

/** Enemy army composition per layer (0-indexed). Boss is the last layer. */
const ENEMY_ARMIES: PieceKind[][] = [
  ['king', 'pawn', 'pawn', 'pawn'],
  ['king', 'pawn', 'pawn', 'knight', 'pawn'],
  ['king', 'pawn', 'pawn', 'knight', 'bishop'],
  ['king', 'pawn', 'pawn', 'pawn', 'knight', 'bishop', 'rook'],
  ['king', 'queen', 'rook', 'ninja', 'pawn', 'pawn', 'pawn', 'pawn'], // boss
];

const ELITE_BONUS: PieceKind[] = ['ninja', 'magicalGirl', 'rook'];

export const MAX_ARMY = 12;

export class Run {
  army: PieceKind[] = ['king', 'knight', 'bishop', 'pawn', 'pawn'];
  gold = 10;
  layer = 0; // next layer to play
  layers: MapNode[][] = [];
  /** node chosen on each completed layer, for map drawing */
  chosen: number[] = [];
  shopStock: ShopOffer[] = [];

  constructor(seedLayers?: MapNode[][]) {
    this.layers = seedLayers ?? Run.generateMap();
  }

  static generateMap(): MapNode[][] {
    // 5 layers: fixed opener and boss, choices in between
    const plan: NodeType[][] = [
      ['battle'],
      shuffle(['battle', 'shop']),
      shuffle(['elite', 'battle']),
      shuffle(['shop', 'battle']),
      ['boss'],
    ];
    return plan.map((types, layer) =>
      types.map((type, index) => ({ layer, index, type })),
    );
  }

  get done(): boolean {
    return this.layer >= this.layers.length;
  }

  currentChoices(): MapNode[] {
    return this.done ? [] : this.layers[this.layer];
  }

  enemyArmyFor(node: MapNode): PieceKind[] {
    const base = [...ENEMY_ARMIES[Math.min(node.layer, ENEMY_ARMIES.length - 1)]];
    if (node.type === 'elite') {
      base.push(ELITE_BONUS[Math.floor(Math.random() * ELITE_BONUS.length)]);
    }
    return base;
  }

  goldRewardFor(node: MapNode): number {
    const base = 8 + node.layer * 4;
    return node.type === 'elite' ? base * 2 : base;
  }

  rollShop(): void {
    const pool = shuffle([...SHOP_POOL]);
    this.shopStock = pool.slice(0, 4).map((kind) => ({
      kind,
      price: SHOP_PRICES[kind]!,
    }));
  }

  buy(offerIndex: number): boolean {
    const offer = this.shopStock[offerIndex];
    if (!offer) return false;
    if (this.gold < offer.price || this.army.length >= MAX_ARMY) return false;
    this.gold -= offer.price;
    this.army.push(offer.kind);
    this.shopStock.splice(offerIndex, 1);
    return true;
  }

  /** Mark the chosen node complete and advance to the next layer. */
  completeNode(node: MapNode): void {
    this.chosen[node.layer] = node.index;
    this.layer = node.layer + 1;
  }
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Deploy an army onto home rows. Strongest pieces go to the back row,
 * king centered; pawns up front.
 */
export function deployment(army: PieceKind[], side: 'player' | 'enemy'): { kind: PieceKind; x: number; y: number }[] {
  const backRank = side === 'player' ? 0 : 7;
  const frontRank = side === 'player' ? 1 : 6;
  const back: PieceKind[] = [];
  const front: PieceKind[] = [];
  for (const kind of army) {
    (kind === 'pawn' || kind === 'sakuraPawn' ? front : back).push(kind);
  }
  // overflow spills to the other row
  while (back.length > 8) front.push(back.pop()!);
  while (front.length > 8) back.push(front.pop()!);

  // center each row: king in the middle of the back row
  back.sort((a, b) => (a === 'king' ? -1 : b === 'king' ? 1 : 0));
  const placeRow = (kinds: PieceKind[], y: number) => {
    const order = centerOrder(kinds.length);
    return kinds.map((kind, i) => ({ kind, x: order[i], y }));
  };
  return [...placeRow(back, backRank), ...placeRow(front, frontRank)];
}

/** x-coordinates fanning out from the center: 3,4,2,5,1,6,0,7 */
function centerOrder(count: number): number[] {
  const seq = [3, 4, 2, 5, 1, 6, 0, 7];
  return seq.slice(0, count);
}
