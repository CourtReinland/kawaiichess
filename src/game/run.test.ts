import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_STAGES,
  acceptDraft,
  advanceStage,
  buildDeployPieces,
  createRunState,
  extractDeployments,
  generateDraft,
  isRunComplete,
  placePlayerArmy,
  saveRun,
  loadRun,
  startBattle,
} from './run';

describe('run state', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });


  it('creates a new run with a starting army and stages', () => {
    const run = createRunState();
    expect(run.playerArmy.length).toBeGreaterThan(0);
    expect(run.stages.length).toBe(MAX_STAGES);
    expect(run.stageIndex).toBe(0);
    expect(run.gold).toBe(0);
  });

  it('starts a battle with player and enemy pieces', () => {
    const run = createRunState();
    const battle = startBattle(run);
    expect(battle.pieces.some((p) => p.side === 'player')).toBe(true);
    expect(battle.pieces.some((p) => p.side === 'enemy')).toBe(true);
    expect(battle.phase).toBe('battle');
  });

  it('places the player army on the board', () => {
    const army = ['king', 'rook', 'bishop', 'knight', 'pawn', 'pawn'];
    const placed = placePlayerArmy(army);
    expect(placed.length).toBe(army.length);
    const positions = placed.map((p) => `${p.position.x},${p.position.y}`);
    expect(new Set(positions).size).toBe(positions.length);
  });

  it('advances stage and awards gold', () => {
    let run = createRunState();
    const initialGold = run.gold;
    run = advanceStage(run);
    expect(run.stageIndex).toBe(1);
    expect(run.gold).toBeGreaterThan(initialGold);
    expect(run.victories).toBe(1);
  });

  it('completes the run after all stages', () => {
    let run = createRunState();
    for (let i = 0; i < MAX_STAGES; i++) {
      run = advanceStage(run);
    }
    expect(isRunComplete(run)).toBe(true);
  });

  it('accepts a drafted piece into the army', () => {
    let run = createRunState();
    run = acceptDraft(run, 'celestial-mage');
    expect(run.playerArmy).toContain('celestial-mage');
    expect(run.draftedPieces).toContain('celestial-mage');
  });

  it('generates draft options from unlocked tiers', () => {
    const run = createRunState();
    const options = generateDraft(run);
    expect(options.length).toBeLessThanOrEqual(3);
    for (const piece of options) {
      expect(piece.tier).toBe(1);
    }
  });

  it('builds deploy pieces from saved deployments', () => {
    const run = createRunState();
    run.deployments['king-0'] = { x: 4, y: 0 };
    const pieces = buildDeployPieces(run);
    const king = pieces.find((p) => p.definitionId === 'king');
    expect(king?.position).toEqual({ x: 4, y: 0 });
  });

  it('extracts deployments from deploy pieces', () => {
    const pieces = [
      { id: 'king-0', definitionId: 'king', position: { x: 4, y: 0 } },
      { id: 'rook-1', definitionId: 'rook', position: undefined },
    ];
    const deployments = extractDeployments(pieces);
    expect(deployments['king-0']).toEqual({ x: 4, y: 0 });
    expect(deployments['rook-1']).toBeUndefined();
  });

  it('persists deployments through save/load', () => {
    let run = createRunState();
    run.deployments['king-0'] = { x: 4, y: 0 };
    saveRun(run);
    const loaded = loadRun();
    expect(loaded?.deployments['king-0']).toEqual({ x: 4, y: 0 });
  });
});
