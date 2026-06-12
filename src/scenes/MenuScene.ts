import Phaser from 'phaser';
import { Run } from '../core/run';
import { COLORS, FONT, GAME_H, GAME_W, makeButton, makeTitle } from '../ui/theme';
import { tokenKey } from '../ui/tokens';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.55);

    makeTitle(this, GAME_W / 2, 220, 'Kawaii', 110);
    makeTitle(this, GAME_W / 2, 340, 'Chess', 110);
    this.add
      .text(GAME_W / 2, 432, '~ a cute little roguelike ~', {
        fontFamily: FONT, fontSize: '30px', color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // parade of character tokens
    const kinds = ['king', 'queen', 'magicalGirl', 'ninja', 'pawn'] as const;
    kinds.forEach((kind, i) => {
      const x = GAME_W / 2 + (i - 2) * 124;
      const token = this.add.image(x, 600, tokenKey(kind, 'player')).setScale(0.82);
      this.tweens.add({
        targets: token,
        y: 588,
        duration: 900 + i * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    makeButton(this, GAME_W / 2, 820, 'New Run ♟', () => {
      const run = new Run();
      this.registry.set('run', run);
      this.scene.start('Map');
    }, { width: 380, height: 104, fontSize: 42 });

    this.add
      .text(GAME_W / 2, 980, 'Capture the enemy King to win.\nLose your King and the run is over!', {
        fontFamily: FONT, fontSize: '24px', color: COLORS.textDark, align: 'center',
      })
      .setOrigin(0.5);
  }
}

/** Scale an image so it covers the whole game area (like CSS background-size: cover). */
export function coverFit(img: Phaser.GameObjects.Image): void {
  const scale = Math.max(GAME_W / img.width, GAME_H / img.height);
  img.setScale(scale);
}
