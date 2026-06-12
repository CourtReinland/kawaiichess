import { COLORS } from './theme';
import type { PieceKind, Side } from '../core/types';

/** Which art file backs each piece kind. */
export const PIECE_ART: Record<PieceKind, string> = {
  pawn: 'art_pawn',
  sakuraPawn: 'art_pawnVariant',
  knight: 'art_knight',
  ninja: 'art_knight',
  bishop: 'art_bishop',
  rook: 'art_rook',
  magicalGirl: 'art_rook',
  queen: 'art_queen',
  king: 'art_king',
};

/** Badge emoji rendered on variants that share art with a base piece. */
const BADGE: Partial<Record<PieceKind, string>> = {
  ninja: '🌙',
  magicalGirl: '✨',
  sakuraPawn: '🌸',
};

export const TOKEN_SIZE = 144;

export function tokenKey(kind: PieceKind, side: Side): string {
  return `tok_${kind}_${side}`;
}

/**
 * Pre-render every piece token as a circular face crop of the source art,
 * ringed in the team color. Call once after art is loaded.
 */
export function generateTokens(scene: Phaser.Scene): void {
  const kinds = Object.keys(PIECE_ART) as PieceKind[];
  for (const kind of kinds) {
    for (const side of ['player', 'enemy'] as Side[]) {
      const key = tokenKey(kind, side);
      if (scene.textures.exists(key)) continue;

      const tex = scene.textures.createCanvas(key, TOKEN_SIZE, TOKEN_SIZE)!;
      const ctx = tex.getContext();
      const src = scene.textures.get(PIECE_ART[kind]).getSourceImage() as HTMLImageElement;

      const cx = TOKEN_SIZE / 2;
      const radius = TOKEN_SIZE / 2 - 6;

      // soft white backing so JPG backgrounds blend away at the rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cx, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#fff4f7';
      ctx.fillRect(0, 0, TOKEN_SIZE, TOKEN_SIZE);
      // crop the upper-middle of the 1024px art (faces sit around y≈400)
      const cropHalf = 340;
      ctx.drawImage(
        src,
        512 - cropHalf, 400 - cropHalf, cropHalf * 2, cropHalf * 2,
        0, 0, TOKEN_SIZE, TOKEN_SIZE,
      );
      ctx.restore();

      // team ring
      const ring = side === 'player' ? COLORS.pink : COLORS.purple;
      ctx.beginPath();
      ctx.arc(cx, cx, radius, 0, Math.PI * 2);
      ctx.lineWidth = 9;
      ctx.strokeStyle = `#${ring.toString(16).padStart(6, '0')}`;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cx, radius - 6, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.stroke();

      const badge = BADGE[kind];
      if (badge) {
        ctx.font = '34px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badge, TOKEN_SIZE - 30, TOKEN_SIZE - 28);
      }
      tex.refresh();
    }
  }

  // small soft particle for sparkle effects
  if (!scene.textures.exists('sparkle')) {
    const tex = scene.textures.createCanvas('sparkle', 16, 16)!;
    const ctx = tex.getContext();
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(255,214,231,0.8)');
    grad.addColorStop(1, 'rgba(255,214,231,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    tex.refresh();
  }
}
