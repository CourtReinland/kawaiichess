import Phaser from 'phaser';
import { COLORS, FONT, GAME_H, GAME_W, makeButton, makeTitle } from '../ui/theme';
import { tokenKey } from '../ui/tokens';
import { coverFit } from './MenuScene';

export class RunVictoryScene extends Phaser.Scene {
  constructor() {
    super('RunVictory');
  }

  create(): void {
    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.55);

    const banner = this.add.image(GAME_W / 2, 300, 'banner_victory');
    banner.setScale(Math.min(640 / banner.width, 1));
    banner.setBlendMode(Phaser.BlendModes.MULTIPLY); // hide the JPG's white backing
    makeTitle(this, GAME_W / 2, 520, 'Run Complete!', 72);
    this.add
      .text(GAME_W / 2, 610, 'The Kawaii Kingdom is saved 👑✨', {
        fontFamily: FONT, fontSize: '30px', color: COLORS.textDark,
      })
      .setOrigin(0.5);

    const king = this.add.image(GAME_W / 2, 790, tokenKey('king', 'player')).setScale(1.5);
    this.tweens.add({
      targets: king, y: 775, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // celebratory sparkle rain
    this.time.addEvent({
      delay: 350,
      repeat: 12,
      callback: () => {
        const e = this.add.particles(Phaser.Math.Between(60, GAME_W - 60), Phaser.Math.Between(150, 900), 'sparkle', {
          speed: { min: 40, max: 160 },
          scale: { start: 1.8, end: 0 },
          lifespan: 700,
          tint: [COLORS.gold, COLORS.pink, COLORS.purpleLight],
          emitting: false,
        });
        e.explode(14);
        this.time.delayedCall(900, () => e.destroy());
      },
    });

    makeButton(this, GAME_W / 2, 1010, 'Play Again ♟', () => this.scene.start('Menu'), {
      width: 380, height: 100, fontSize: 38,
    });
  }
}
