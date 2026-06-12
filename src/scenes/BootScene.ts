import Phaser from 'phaser';
import { generateTokens } from '../ui/tokens';
import { COLORS, FONT, GAME_H, GAME_W } from '../ui/theme';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    const barBg = this.add.rectangle(GAME_W / 2, GAME_H / 2, 420, 26, COLORS.pinkLight).setStrokeStyle(3, COLORS.pink);
    const bar = this.add.rectangle(GAME_W / 2 - 205, GAME_H / 2, 1, 16, COLORS.pink).setOrigin(0, 0.5);
    this.add
      .text(GAME_W / 2, GAME_H / 2 - 50, 'Loading cuteness…', {
        fontFamily: FONT, fontSize: '28px', color: COLORS.textPink,
      })
      .setOrigin(0.5);
    this.load.on('progress', (v: number) => bar.setSize(410 * v, 16));
    this.load.on('complete', () => { bar.destroy(); barBg.destroy(); });

    this.load.image('art_pawn', 'art/Pawn_Common_Schoolgirl.jpg');
    this.load.image('art_pawnVariant', 'art/Pawn_Variant.jpg');
    this.load.image('art_knight', 'art/Knight_NinjaKnight.jpg');
    this.load.image('art_bishop', 'art/Bishop_Magical.jpg');
    this.load.image('art_rook', 'art/Rook_MagicalGirlRook.jpg');
    this.load.image('art_queen', 'art/Queen_Legendary.jpg');
    this.load.image('art_king', 'art/King_Regal.jpg');
    this.load.image('bg_table', 'art/MagicalTableBackground.jpg');
    this.load.image('banner_victory', 'art/VictoryBanner_Sparkle.jpg');
  }

  create(): void {
    generateTokens(this);
    this.scene.start('Menu');
  }
}
