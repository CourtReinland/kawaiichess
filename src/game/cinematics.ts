import type { BattleState, BattleEndScene, CaptureScene, PieceDefinition } from './types';
import { findRoyal, getDefinition } from './board';

const CAPTURE_LINES: Record<
  string,
  { attacker: string[]; defender?: string[]; animation: CaptureScene['animation'] }
> = {
  default: {
    attacker: ['Take this!', 'For the win!', 'Too slow!', 'Checkmate incoming!'],
    animation: 'slash',
  },
  magical: {
    attacker: ['Sparkle strike!', 'Love-powered beam!', 'Kawaii blast!'],
    defender: ['So bright...!', 'N-no way...'],
    animation: 'magic',
  },
  fierce: {
    attacker: ['Nothing personal!', 'Slice and dice!', 'You fought well.'],
    defender: ['I... I lost?', 'Impossible...'],
    animation: 'slash',
  },
  heavy: {
    attacker: ['Crushing blow!', 'Down you go!', 'Squish!'],
    animation: 'crush',
  },
  cute: {
    attacker: ['Boop!', 'Sorry-not-sorry!', "You're out!"],
    defender: ['Eeep!', 'How mean...'],
    animation: 'charm',
  },
  beast: {
    attacker: ['Rawr!', 'Chomp!', 'My prey!'],
    defender: ['S-so scary...'],
    animation: 'bite',
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sceneStyleFor(def: PieceDefinition): keyof typeof CAPTURE_LINES {
  if (def.category === 'offensive') return 'fierce';
  if (def.category === 'control') return 'magical';
  if (def.category === 'support') return 'cute';
  if (def.category === 'defensive') return 'heavy';
  if (def.category === 'trickster') return 'beast';
  if (def.movement === 'dragon' || def.id.includes('dragon')) return 'beast';
  if (def.movement === 'knight' || def.id.includes('knight')) return 'fierce';
  return 'default';
}

export function getCaptureScene(
  attacker: PieceDefinition,
  _defender: PieceDefinition,
): CaptureScene {
  const style = sceneStyleFor(attacker);
  const lines = CAPTURE_LINES[style];
  return {
    attackerLine: pick(lines.attacker),
    defenderLine: lines.defender ? pick(lines.defender) : undefined,
    animation: lines.animation,
  };
}

const VICTORY_TAUNTS: string[] = [
  'Better luck next time!',
  "That's how a kawaii champion does it!",
  'You never stood a chance!',
  'Victory is mine! 💖',
  'Thanks for the practice!',
];

const DEFEAT_LINES: string[] = [
  "I'll get stronger...",
  "This can't be the end...",
  'Nooo! My perfect strategy!',
  'Rewind... please?',
];

const WINNER_BANNERS: string[] = ['WINNER', 'VICTORY', 'PERFECT', 'KAWAII CHAMP'];
const LOSER_BANNERS: string[] = ['GAME OVER', 'DEFEATED', 'K.O.', 'TRY AGAIN'];

export function getBattleEndScene(
  battle: BattleState,
  sideWon: 'player' | 'enemy',
): BattleEndScene {
  const winnerRoyal = findRoyal(battle, sideWon);
  const loserRoyal = findRoyal(battle, sideWon === 'player' ? 'enemy' : 'player');

  // If the royal was captured, find any surviving piece for the winner icon.
  const winnerPiece = winnerRoyal ?? battle.pieces.find((p) => p.side === sideWon);
  const loserPiece = loserRoyal ?? battle.pieces.find((p) => p.side !== sideWon);

  const winnerIcon = winnerPiece ? getDefinition(winnerPiece).icon : '👑';
  const loserIcon = loserPiece ? getDefinition(loserPiece).icon : '💀';

  if (sideWon === 'player') {
    return {
      winnerIcon,
      loserIcon,
      winnerLine: pick(VICTORY_TAUNTS),
      loserLine: pick(DEFEAT_LINES),
      banner: pick(WINNER_BANNERS),
    };
  }

  return {
    winnerIcon,
    loserIcon,
    winnerLine: pick(VICTORY_TAUNTS),
    loserLine: pick(DEFEAT_LINES),
    banner: pick(LOSER_BANNERS),
  };
}
