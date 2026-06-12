import Phaser from 'phaser';
import { hasSave, loadRun } from '../core/save';
import { PIECE_MOVE, PIECE_NAME, type PieceKind } from '../core/types';
import { COLORS, FONT, GAME_H, GAME_W, makeButton, makeTitle } from '../ui/theme';
import { tokenKey } from '../ui/tokens';

const LEGEND: PieceKind[] = [
  'pawn', 'sakuraPawn', 'knight', 'ninja', 'bishop', 'rook', 'magicalGirl', 'queen', 'king',
];

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.55);

    makeTitle(this, GAME_W / 2, 190, 'Kawaii', 104);
    makeTitle(this, GAME_W / 2, 300, 'Chess', 104);
    this.add
      .text(GAME_W / 2, 386, '~ a cute little roguelike ~', {
        fontFamily: FONT, fontSize: '30px', color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // parade of character tokens
    const kinds = ['king', 'queen', 'magicalGirl', 'ninja', 'pawn'] as const;
    kinds.forEach((kind, i) => {
      const x = GAME_W / 2 + (i - 2) * 124;
      const token = this.add.image(x, 540, tokenKey(kind, 'player')).setScale(0.82);
      this.tweens.add({
        targets: token,
        y: 528,
        duration: 900 + i * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    const resumable = hasSave();
    let y = resumable ? 730 : 790;

    if (resumable) {
      makeButton(this, GAME_W / 2, y, 'Continue ♡', () => {
        const run = loadRun();
        if (!run) return this.scene.restart();
        this.registry.set('run', run);
        this.scene.start('Map');
      }, { width: 380, height: 100, fontSize: 40, color: COLORS.gold });
      y += 128;
    }

    makeButton(this, GAME_W / 2, y, 'New Run ♟', () => this.scene.start('Setup'), {
      width: 380, height: 100, fontSize: 40,
    });
    y += 128;

    makeButton(this, GAME_W / 2, y, 'How to Play 📖', () => this.showLegend(), {
      width: 380, height: 84, fontSize: 30, color: COLORS.purple,
    });

    this.add
      .text(GAME_W / 2, GAME_H - 80, 'Capture the enemy King to win.\nLose your King and the run is over!', {
        fontFamily: FONT, fontSize: '23px', color: COLORS.textDark, align: 'center',
      })
      .setOrigin(0.5);
  }

  private showLegend(): void {
    const blocker = this.add
      .rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x2a1030, 0.6)
      .setDepth(50)
      .setInteractive();

    const panel = this.add.graphics().setDepth(51);
    const pw = 640;
    const ph = 1040;
    const px = (GAME_W - pw) / 2;
    const py = (GAME_H - ph) / 2;
    panel.fillStyle(0xfff4f7, 0.98);
    panel.fillRoundedRect(px, py, pw, ph, 28);
    panel.lineStyle(5, COLORS.pink, 1);
    panel.strokeRoundedRect(px, py, pw, ph, 28);

    const items: Phaser.GameObjects.GameObject[] = [blocker, panel];
    items.push(makeTitle(this, GAME_W / 2, py + 58, 'Meet the Pieces', 40).setDepth(52));

    LEGEND.forEach((kind, i) => {
      const ry = py + 130 + i * 92;
      items.push(this.add.image(px + 70, ry, tokenKey(kind, 'player')).setScale(0.52).setDepth(52));
      items.push(
        this.add
          .text(px + 125, ry - 18, PIECE_NAME[kind], {
            fontFamily: FONT, fontSize: '25px', color: COLORS.textPink,
          })
          .setOrigin(0, 0.5)
          .setDepth(52),
      );
      items.push(
        this.add
          .text(px + 125, ry + 14, PIECE_MOVE[kind], {
            fontFamily: FONT, fontSize: '20px', color: COLORS.textDark,
          })
          .setOrigin(0, 0.5)
          .setDepth(52),
      );
    });

    items.push(
      makeButton(this, GAME_W / 2, py + ph - 60, 'Got it! ♡', () => {
        items.forEach((o) => o.destroy());
      }, { width: 280, height: 76, fontSize: 28 }).setDepth(52),
    );
  }
}

/** Scale an image so it covers the whole game area (like CSS background-size: cover). */
export function coverFit(img: Phaser.GameObjects.Image): void {
  const scale = Math.max(GAME_W / img.width, GAME_H / img.height);
  img.setScale(scale);
}
