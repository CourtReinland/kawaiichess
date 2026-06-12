import Phaser from 'phaser';
import { DRAFT_BUDGET, MAX_ARMY, Run, SHOP_PRICES } from '../core/run';
import { saveRun } from '../core/save';
import { PIECE_NAME, type PieceKind } from '../core/types';
import { COLORS, FONT, GAME_H, GAME_W, makeButton, makeTitle } from '../ui/theme';
import { tokenKey } from '../ui/tokens';
import { coverFit } from './MenuScene';

const CATALOG: PieceKind[] = [
  'pawn', 'sakuraPawn', 'knight', 'bishop', 'rook', 'ninja', 'magicalGirl', 'queen',
];

/** Draft your starting army: king is free, spend the budget on the rest. */
export class SetupScene extends Phaser.Scene {
  private picks: PieceKind[] = [];
  private budgetText!: Phaser.GameObjects.Text;
  private armyText!: Phaser.GameObjects.Text;
  private countTexts = new Map<PieceKind, Phaser.GameObjects.Text>();
  private priceTexts = new Map<PieceKind, Phaser.GameObjects.Text>();

  constructor() {
    super('Setup');
  }

  create(): void {
    // classic starter as the default — one tap to begin
    this.picks = ['knight', 'bishop', 'pawn', 'pawn'];
    this.countTexts.clear();
    this.priceTexts.clear();

    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.66);

    makeTitle(this, GAME_W / 2, 76, 'Choose Your Party', 50);
    this.budgetText = this.add
      .text(GAME_W / 2, 140, '', { fontFamily: FONT, fontSize: '30px', color: COLORS.textPink })
      .setOrigin(0.5);
    this.armyText = this.add
      .text(GAME_W / 2, 184, '', { fontFamily: FONT, fontSize: '24px', color: COLORS.textDark })
      .setOrigin(0.5);

    // the king comes free
    this.add.image(110, 270, tokenKey('king', 'player')).setScale(0.62);
    this.add
      .text(160, 270, 'Regal King — leads every party, free!', {
        fontFamily: FONT, fontSize: '24px', color: COLORS.textDark,
      })
      .setOrigin(0, 0.5);

    CATALOG.forEach((kind, i) => this.drawCard(kind, i));

    makeButton(this, GAME_W / 2, GAME_H - 90, 'Start Adventure ➜', () => {
      const run = new Run();
      run.army = ['king', ...this.picks];
      run.gold = this.remaining();
      this.registry.set('run', run);
      saveRun(run);
      this.scene.start('Map');
    }, { width: 420, height: 96, fontSize: 36 });

    this.refresh();
  }

  private spent(): number {
    return this.picks.reduce((sum, kind) => sum + SHOP_PRICES[kind]!, 0);
  }

  private remaining(): number {
    return DRAFT_BUDGET - this.spent();
  }

  private drawCard(kind: PieceKind, i: number): void {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = GAME_W / 2 + (col === 0 ? -172 : 172);
    const y = 400 + row * 168;

    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.92);
    g.fillRoundedRect(x - 160, y - 74, 320, 148, 20);
    g.lineStyle(3, COLORS.pink, 0.9);
    g.strokeRoundedRect(x - 160, y - 74, 320, 148, 20);

    this.add.image(x - 102, y - 14, tokenKey(kind, 'player')).setScale(0.58);
    this.add
      .text(x - 38, y - 44, PIECE_NAME[kind], {
        fontFamily: FONT, fontSize: '21px', color: COLORS.textDark,
      })
      .setOrigin(0, 0.5);
    const price = this.add
      .text(x - 38, y - 12, `💰 ${SHOP_PRICES[kind]}`, {
        fontFamily: FONT, fontSize: '24px', color: COLORS.textPink,
      })
      .setOrigin(0, 0.5);
    this.priceTexts.set(kind, price);

    const count = this.add
      .text(x - 102, y + 48, '', { fontFamily: FONT, fontSize: '26px', color: COLORS.textPink })
      .setOrigin(0.5);
    this.countTexts.set(kind, count);

    const minus = this.add
      .text(x + 40, y + 30, '−', {
        fontFamily: FONT, fontSize: '44px', color: '#ffffff',
        backgroundColor: '#cdbcf2', padding: { x: 18, y: 0 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    minus.on('pointerup', () => {
      const idx = this.picks.indexOf(kind);
      if (idx >= 0) {
        this.picks.splice(idx, 1);
        this.refresh();
      }
    });

    const plus = this.add
      .text(x + 118, y + 30, '+', {
        fontFamily: FONT, fontSize: '44px', color: '#ffffff',
        backgroundColor: '#ff7bac', padding: { x: 14, y: 0 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    plus.on('pointerup', () => {
      const affordable = this.remaining() >= SHOP_PRICES[kind]!;
      const hasRoom = this.picks.length + 1 < MAX_ARMY; // +1 for the king
      if (affordable && hasRoom) {
        this.picks.push(kind);
        this.refresh();
      } else {
        this.tweens.add({ targets: plus, x: plus.x + 6, duration: 45, yoyo: true, repeat: 2 });
      }
    });
  }

  private refresh(): void {
    this.budgetText.setText(`💰 ${this.remaining()} / ${DRAFT_BUDGET} gold left — leftovers come with you!`);
    this.armyText.setText(`Party: ${this.picks.length + 1}/${MAX_ARMY} (King included)`);
    for (const kind of CATALOG) {
      const n = this.picks.filter((k) => k === kind).length;
      this.countTexts.get(kind)!.setText(n > 0 ? `×${n}` : '');
      const affordable = this.remaining() >= SHOP_PRICES[kind]!;
      this.priceTexts.get(kind)!.setColor(affordable ? COLORS.textPink : '#b0a0ad');
    }
  }
}
