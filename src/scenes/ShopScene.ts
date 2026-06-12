import Phaser from 'phaser';
import { MAX_ARMY, type MapNode, type Run } from '../core/run';
import { saveRun } from '../core/save';
import { PIECE_NAME } from '../core/types';
import { COLORS, FONT, GAME_H, GAME_W, makeButton, makeTitle } from '../ui/theme';
import { tokenKey } from '../ui/tokens';
import { coverFit } from './MenuScene';

export class ShopScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private armyText!: Phaser.GameObjects.Text;
  private cards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super('Shop');
  }

  create(): void {
    const run = this.registry.get('run') as Run;
    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.62);

    makeTitle(this, GAME_W / 2, 90, '🛍️ Recruit Friends', 52);
    this.goldText = this.add
      .text(GAME_W / 2, 160, '', { fontFamily: FONT, fontSize: '32px', color: COLORS.textPink })
      .setOrigin(0.5);
    this.armyText = this.add
      .text(GAME_W / 2, 206, '', { fontFamily: FONT, fontSize: '24px', color: COLORS.textDark })
      .setOrigin(0.5);
    this.refreshHud(run);
    this.drawOffers(run);

    makeButton(this, GAME_W / 2, GAME_H - 130, 'Leave Shop ➜', () => {
      const node = this.registry.get('node') as MapNode;
      run.completeNode(node);
      this.scene.start('Map');
    }, { color: COLORS.purple });
  }

  private refreshHud(run: Run): void {
    this.goldText.setText(`💰 ${run.gold} gold`);
    this.armyText.setText(`Army: ${run.army.length}/${MAX_ARMY} pieces`);
  }

  private drawOffers(run: Run): void {
    this.cards.forEach((c) => c.destroy());
    this.cards = [];
    const top = 320;
    run.shopStock.forEach((offer, i) => {
      const x = GAME_W / 2 + (i % 2 === 0 ? -165 : 165);
      const y = top + Math.floor(i / 2) * 330 + 130;
      const card = this.add.container(x, y);

      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.92);
      g.fillRoundedRect(-145, -150, 290, 300, 24);
      g.lineStyle(4, COLORS.pink, 1);
      g.strokeRoundedRect(-145, -150, 290, 300, 24);
      card.add(g);

      card.add(this.add.image(0, -55, tokenKey(offer.kind, 'player')).setScale(0.95));
      card.add(
        this.add
          .text(0, 55, PIECE_NAME[offer.kind], {
            fontFamily: FONT, fontSize: '24px', color: COLORS.textDark,
          })
          .setOrigin(0.5),
      );
      const affordable = run.gold >= offer.price && run.army.length < MAX_ARMY;
      const price = this.add
        .text(0, 102, `💰 ${offer.price}`, {
          fontFamily: FONT, fontSize: '30px',
          color: affordable ? COLORS.textPink : '#b0a0ad',
        })
        .setOrigin(0.5);
      card.add(price);

      card.setSize(290, 300);
      card.setInteractive({ useHandCursor: true });
      card.on('pointerup', () => {
        const idx = run.shopStock.indexOf(offer);
        if (run.buy(idx)) {
          saveRun(run);
          this.refreshHud(run);
          this.drawOffers(run); // re-render remaining stock
        } else {
          this.tweens.add({ targets: card, x: x + 8, duration: 50, yoyo: true, repeat: 2 });
        }
      });
      this.cards.push(card);
    });

    if (run.shopStock.length === 0) {
      const empty = this.add
        .text(GAME_W / 2, 520, 'All sold out! ♡', {
          fontFamily: FONT, fontSize: '34px', color: COLORS.textDark,
        })
        .setOrigin(0.5);
      this.cards.push(this.add.container(0, 0, [empty]));
    }
  }
}
