export interface Position {
  x: number;
  y: number;
}

export type Side = 'player' | 'enemy';

export type MovementType =
  | 'king'
  | 'queen'
  | 'rook'
  | 'bishop'
  | 'knight'
  | 'pawn'
  | 'short-rook'
  | 'short-queen'
  | 'extended-knight'
  | 'dragon'
  | 'jump-king'
  | 'bishop-range'
  | 'king-plus-one';

export type AbilityTrigger = 'on-select' | 'on-move' | 'on-capture' | 'passive' | 'active';

export interface AbilityDefinition {
  name: string;
  description: string;
  trigger: AbilityTrigger;
  /** Max uses per battle; undefined means unlimited. */
  uses?: number;
  /** Range of the ability in squares. */
  range?: number;
}

export interface PieceDefinition {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  category: 'offensive' | 'defensive' | 'support' | 'control' | 'trickster' | 'utility';
  movement: MovementType;
  /** Movement range in squares. 0 or undefined means unlimited (sliding). */
  range?: number;
  /** True if the piece can ignore blocking pieces. */
  canJump?: boolean;
  /** Starting max uses for limited abilities. */
  ability?: AbilityDefinition;
  /** Emoji/icon representation. */
  icon: string;
  /** Whether this is a royal piece whose capture ends the battle. */
  isRoyal?: boolean;
  /** For royal pieces only: starting position relative to the army. */
  defaultRank?: number;
  /** For pawns: promotion target defaults to queen. */
  promotionTarget?: string;
  /** One-sentence character personality blurb. */
  personality?: string;
  /** Short in-character line for cutscenes, draft cards, and intros. */
  flavorQuote?: string;
  /** Uniform theme key used for CSS styling. */
  uniformTheme?: string;
  /** File name of the 2D dialogue portrait under public/characters/portraits/. */
  portraitImage?: string;
  /** File name of the board mini image under public/characters/minis/. */
  miniImage?: string;
  /** File name of optional full-body splash art under public/characters/fullbody/. */
  fullbodyImage?: string;
  /** Paragraph-length character backstory. */
  backstory?: string;
  /** Relationships to other pieces: keyed by piece id, value is a short relationship note. */
  relationships?: Record<string, string>;
  /** If true, this piece is only used by enemy academies and will not appear in player drafts. */
  enemyOnly?: boolean;
}

export interface PieceInstance {
  id: string;
  definitionId: string;
  side: Side;
  position: Position;
  /** Remaining uses for the piece's ability this battle. */
  abilityUsesLeft?: number;
  /** Whether this piece has already moved this turn. */
  hasMoved?: boolean;
  /** Whether this piece is currently promoted. */
  promoted?: boolean;
  /** Buffs/debuffs active on this piece. */
  statusEffects?: StatusEffect[];
}

export interface StatusEffect {
  type: 'barrier' | 'buff' | 'slow' | 'stun';
  turnsRemaining: number;
}

export interface Move {
  pieceId: string;
  from: Position;
  to: Position;
  capture?: PieceInstance;
  ability?: AbilityUse;
}

export interface AbilityUse {
  pieceId: string;
  abilityName: string;
  target?: Position;
}

export type GamePhase = 'battle' | 'draft' | 'victory' | 'defeat' | 'run-complete';

export interface BattleState {
  pieces: PieceInstance[];
  width: number;
  height: number;
  turn: Side;
  phase: GamePhase;
  selectedPieceId?: string;
  highlightedMoves: Move[];
  lastMove?: Move;
  /** Battle log messages for the UI. */
  log: string[];
}

export interface AcademyDefinition {
  id: string;
  name: string;
  crestImage: string;
  uniformTheme: string;
  flavorText: string;
  isPlayerSchool?: boolean;
  /** File name of a backdrop image under public/academies/backdrops/. */
  backdropImage?: string;
  /** Story scene played before this match. */
  introSceneId?: string;
  /** Story scene played after this match. */
  outroSceneId?: string;
}

export interface StageFormation {
  name: string;
  academyId: string;
  enemyPieces: { definitionId: string; position: Position }[];
  rewardGold: number;
  /** AI difficulty for this stage (search depth for minimax). */
  difficulty: number;
}

export interface RunState {
  stageIndex: number;
  stages: StageFormation[];
  playerArmy: string[];
  draftedPieces: string[];
  /** Persistent deployment positions keyed by piece instance id. */
  deployments: Record<string, Position>;
  gold: number;
  victories: number;
  defeats: number;
  runStartedAt: number;
}

export interface DraftOffer {
  options: PieceDefinition[];
}

export type UnitPool = Record<number, PieceDefinition[]>;

export interface CaptureScene {
  attackerLine: string;
  defenderLine?: string;
  animation: 'slash' | 'explosion' | 'magic' | 'bite' | 'crush' | 'charm';
}

export interface BattleEndScene {
  winnerIcon: string;
  loserIcon: string;
  winnerLine: string;
  loserLine?: string;
  banner: string;
}

export interface StoryDialogueLine {
  /** Display name of the speaker. */
  speaker: string;
  /** Piece id used to look up portrait/bio; optional for narration. */
  speakerPieceId?: string;
  /** File name of a portrait under public/characters/portraits/. Overrides speakerPieceId lookup. */
  portraitImage?: string;
  /** Dialogue text. */
  text: string;
  /** Position of the portrait on screen. */
  position?: 'left' | 'right' | 'center';
  /** Optional mood variant for portrait selection. */
  mood?: 'neutral' | 'angry' | 'happy' | 'surprised' | 'flirty';
}

export interface StoryScene {
  id: string;
  /** Background image under public/story/intro/ or public/story/outro/. */
  backgroundImage: string;
  /** Dialogue lines shown in sequence. */
  dialogue: StoryDialogueLine[];
  /** Optional ambient music/sfx key. */
  music?: string;
}

export interface TournamentMapNode {
  id: string;
  academyId: string;
  x: number;
  y: number;
  /** Match index (0-based). */
  matchIndex: number;
  /** Whether this node connects to the next. */
  connectsTo?: string;
}
