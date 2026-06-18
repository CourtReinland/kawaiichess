import { describe, expect, it } from 'vitest';
import {
  PIECE_BY_ID,
  PIECE_DEFINITIONS,
  getDraftPool,
  getUnlockedTiers,
  rollDraftOptions,
} from './pieces';

describe('piece definitions', () => {
  it('contains 55+ design-doc pieces plus standard pieces', () => {
    expect(PIECE_DEFINITIONS.length).toBeGreaterThan(55);
  });

  it('every piece has required fields', () => {
    for (const piece of PIECE_DEFINITIONS) {
      expect(piece.id).toBeTruthy();
      expect(piece.name).toBeTruthy();
      expect(piece.icon).toBeTruthy();
      expect([1, 2, 3]).toContain(piece.tier);
      expect(piece.category).toBeTruthy();
      expect(piece.movement).toBeTruthy();
    }
  });

  it('maps ids correctly', () => {
    expect(PIECE_BY_ID['magical-girl-rook']).toBeDefined();
    expect(PIECE_BY_ID['eternal-queen']?.tier).toBe(3);
  });
});

describe('draft pools', () => {
  it('unlocks tiers based on stage progression', () => {
    expect(getUnlockedTiers(0)).toEqual([1]);
    expect(getUnlockedTiers(2)).toEqual([1]);
    expect(getUnlockedTiers(3)).toEqual([1, 2]);
    expect(getUnlockedTiers(5)).toEqual([1, 2]);
    expect(getUnlockedTiers(6)).toEqual([1, 2, 3]);
  });

  it('offers only unlocked tier pieces', () => {
    const pool = getDraftPool(0, []);
    for (const piece of pool) {
      expect(piece.tier).toBe(1);
    }
  });

  it('excludes pieces already in the army', () => {
    const army = ['magical-girl-rook', 'ninja-knight'];
    const pool = getDraftPool(0, army);
    const ids = pool.map((p) => p.id);
    expect(ids).not.toContain('magical-girl-rook');
    expect(ids).not.toContain('ninja-knight');
  });

  it('rolls up to three unique options', () => {
    const army: string[] = [];
    const options = rollDraftOptions(0, army, 3);
    expect(options.length).toBeLessThanOrEqual(3);
    const ids = options.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
