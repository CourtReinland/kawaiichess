import Phaser from 'phaser';
import { chooseEnemyMove } from '../core/ai';
import { Battle } from '../core/battle';
import { deployment, type MapNode, type Run } from '../core/run';
import { clearSave, saveRun } from '../core/save';
import { PIECE_NAME, type Move, type Piece, type Pos } from '../core/types';
import { COLORS, FONT, GAME_H, GAME_W, makeButton, makeTitle } from '../ui/theme';
import { tokenKey } from '../ui/tokens';
import { coverFit } from './MenuScene';

const CELL = 82;
const BOARD_X = (GAME_W - CELL * 8) / 2;
const BOARD_Y = 250;

export class BattleScene extends Phaser.Scene {
  private battle!: Battle;
  private run!: Run;
  private node!: MapNode;
  private sprites = new Map<number, Phaser.GameObjects.Image>();
  private selected?: Piece;
  private highlights: Phaser.GameObjects.GameObject[] = [];
  private hint!: Phaser.GameObjects.Text;
  private busy = false; // true while animating or AI thinking
  private over = false;

  constructor() {
    super('Battle');
  }

  create(): void {
    this.run = this.registry.get('run') as Run;
    this.node = this.registry.get('node') as MapNode;
    this.sprites.clear();
    this.selected = undefined;
    this.highlights = [];
    this.busy = false;
    this.over = false;

    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.5);

    this.drawBoard();
    this.setupBattle();

    const labels: Record<MapNode['type'], string> = {
      battle: '⚔️ Battle', elite: '🔥 Elite Battle', shop: '', boss: '👑 BOSS Battle',
    };
    makeTitle(this, GAME_W / 2, 80, labels[this.node.type], 46);
    this.hint = this.add
      .text(GAME_W / 2, 156, 'Your move! Tap a piece ♡', {
        fontFamily: FONT, fontSize: '28px', color: COLORS.textPink,
      })
      .setOrigin(0.5);

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.onTap(pointer));
  }

  private drawBoard(): void {
    const g = this.add.graphics();
    g.fillStyle(COLORS.boardFrame, 1);
    g.fillRoundedRect(BOARD_X - 14, BOARD_Y - 14, CELL * 8 + 28, CELL * 8 + 28, 18);
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        g.fillStyle((x + y) % 2 === 0 ? COLORS.boardDark : COLORS.boardLight, 1);
        g.fillRect(BOARD_X + x * CELL, BOARD_Y + y * CELL, CELL, CELL);
      }
    }
    g.lineStyle(3, 0xffffff, 0.8);
    g.strokeRoundedRect(BOARD_X - 14, BOARD_Y - 14, CELL * 8 + 28, CELL * 8 + 28, 18);
  }

  private setupBattle(): void {
    this.battle = new Battle();
    for (const d of deployment(this.run.army, 'player')) {
      this.addSprite(this.battle.spawn(d.kind, 'player', { x: d.x, y: d.y }));
    }
    for (const d of deployment(this.run.enemyArmyFor(this.node), 'enemy')) {
      this.addSprite(this.battle.spawn(d.kind, 'enemy', { x: d.x, y: d.y }));
    }
  }

  private addSprite(piece: Piece): void {
    const { x, y } = this.toScreen(piece.pos);
    const img = this.add.image(x, y, tokenKey(piece.kind, piece.side));
    img.setDisplaySize(CELL - 8, CELL - 8);
    img.setDepth(10);
    this.sprites.set(piece.id, img);
  }

  private toScreen(pos: Pos): { x: number; y: number } {
    return {
      x: BOARD_X + pos.x * CELL + CELL / 2,
      y: BOARD_Y + (7 - pos.y) * CELL + CELL / 2, // player home row at the bottom
    };
  }

  private toBoard(px: number, py: number): Pos | undefined {
    const x = Math.floor((px - BOARD_X) / CELL);
    const yScreen = Math.floor((py - BOARD_Y) / CELL);
    if (x < 0 || x > 7 || yScreen < 0 || yScreen > 7) return undefined;
    return { x, y: 7 - yScreen };
  }

  private onTap(pointer: Phaser.Input.Pointer): void {
    if (this.busy || this.over || this.battle.turn !== 'player') return;
    const pos = this.toBoard(pointer.x, pointer.y);
    if (!pos) return;

    const piece = this.battle.pieceAt(pos);
    if (this.selected) {
      const legal = this.battle.movesFor(this.selected).some((m) => m.x === pos.x && m.y === pos.y);
      if (legal) {
        const target = this.battle.pieceAt(pos);
        const move: Move = {
          pieceId: this.selected.id,
          from: { ...this.selected.pos },
          to: pos,
          captureId: target?.id,
          barrierPopped: target?.barrier ?? false,
          promotion:
            (this.selected.kind === 'pawn' || this.selected.kind === 'sakuraPawn') && pos.y === 7,
        };
        this.clearSelection();
        this.performMove(move, () => this.afterPlayerMove());
        return;
      }
      this.clearSelection();
      // fall through: maybe they tapped another of their pieces
    }
    if (piece && piece.side === 'player') {
      this.selected = piece;
      this.showHighlights(piece);
    }
  }

  private showHighlights(piece: Piece): void {
    this.clearHighlightGfx();
    const { x, y } = this.toScreen(piece.pos);
    const ring = this.add.circle(x, y, CELL / 2 - 2, COLORS.gold, 0.25)
      .setStrokeStyle(4, COLORS.gold, 1).setDepth(5);
    this.highlights.push(ring);
    for (const to of this.battle.movesFor(piece)) {
      const s = this.toScreen(to);
      const target = this.battle.pieceAt(to);
      const dot = target
        ? this.add.circle(s.x, s.y, CELL / 2 - 4, COLORS.pinkDark, 0.0)
            .setStrokeStyle(5, COLORS.pinkDark, 0.95)
        : this.add.circle(s.x, s.y, 13, COLORS.pink, 0.85);
      dot.setDepth(5);
      this.highlights.push(dot);
    }
    this.hint.setText(`${PIECE_NAME[piece.kind]} — tap a sparkle to move!`);
  }

  private clearHighlightGfx(): void {
    this.highlights.forEach((h) => h.destroy());
    this.highlights = [];
  }

  private clearSelection(): void {
    this.selected = undefined;
    this.clearHighlightGfx();
  }

  /** Animate and apply a move for either side. */
  private performMove(move: Move, then: () => void): void {
    this.busy = true;
    const sprite = this.sprites.get(move.pieceId)!;
    const dest = this.toScreen(move.to);
    sprite.setDepth(20);

    if (move.captureId && move.barrierPopped) {
      // barrier absorbs the hit: lunge toward the target, bounce back
      const targetSprite = this.sprites.get(move.captureId)!;
      this.battle.apply(move);
      this.tweens.add({
        targets: sprite,
        x: dest.x, y: dest.y,
        duration: 160,
        yoyo: true,
        ease: 'Quad.easeIn',
        onYoyo: () => {
          this.burst(dest.x, dest.y, 0x9bd4ff);
          this.floatText(dest.x, dest.y - 40, 'Barrier!');
          this.tweens.add({ targets: targetSprite, scale: targetSprite.scale * 1.18, duration: 110, yoyo: true });
        },
        onComplete: () => { sprite.setDepth(10); this.busy = false; then(); },
      });
      return;
    }

    this.battle.apply(move);
    this.tweens.add({
      targets: sprite,
      x: dest.x, y: dest.y,
      duration: 220,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        if (move.captureId) {
          const victim = this.sprites.get(move.captureId)!;
          this.burst(dest.x, dest.y, COLORS.pink);
          this.tweens.add({
            targets: victim,
            scale: 0, angle: 90, alpha: 0,
            duration: 240,
            onComplete: () => victim.destroy(),
          });
          this.sprites.delete(move.captureId);
        }
        if (move.promotion) {
          const piece = this.battle.pieceById(move.pieceId);
          if (piece) {
            sprite.setTexture(tokenKey('queen', piece.side));
            sprite.setDisplaySize(CELL - 8, CELL - 8);
            this.burst(dest.x, dest.y, COLORS.gold);
            this.floatText(dest.x, dest.y - 40, 'Promoted! ✨');
          }
        }
        sprite.setDepth(10);
        this.busy = false;
        then();
      },
    });
  }

  private afterPlayerMove(): void {
    if (this.checkEnd()) return;
    this.hint.setText('Enemy is thinking… 💭');
    // give the renderer a frame before the (synchronous) search
    this.time.delayedCall(350, () => {
      const depth = this.node.layer >= 3 || this.node.type === 'boss' ? 3 : 2;
      const move = chooseEnemyMove(this.battle, depth);
      if (!move) {
        this.checkEnd();
        return;
      }
      this.performMove(move, () => {
        if (!this.checkEnd()) this.hint.setText('Your move! Tap a piece ♡');
      });
    });
  }

  private checkEnd(): boolean {
    const winner = this.battle.winner();
    if (!winner || this.over) return !!winner;
    this.over = true;
    if (winner === 'player') this.showVictory();
    else this.showDefeat();
    return true;
  }

  private showVictory(): void {
    const reward = this.run.goldRewardFor(this.node);
    this.run.gold += reward;
    this.run.completeNode(this.node);
    if (this.run.done) clearSave();
    else saveRun(this.run);

    const dim = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x000000, 0.45).setDepth(30);
    const banner = this.add.image(GAME_W / 2, GAME_H / 2 - 160, 'banner_victory').setDepth(31);
    banner.setScale(Math.min(620 / banner.width, 1));
    banner.setBlendMode(Phaser.BlendModes.SCREEN); // hide the JPG's white backing over the dim overlay
    makeTitle(this, GAME_W / 2, GAME_H / 2 + 60, 'Victory!', 72).setDepth(31);
    this.add
      .text(GAME_W / 2, GAME_H / 2 + 140, `+${reward} gold 💰`, {
        fontFamily: FONT, fontSize: '36px', color: '#ffe9a8',
      })
      .setOrigin(0.5)
      .setDepth(31);
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 180, () =>
        this.burst(120 + Math.random() * 480, 300 + Math.random() * 500, COLORS.gold),
      );
    }
    const isLastLayer = this.run.done;
    makeButton(this, GAME_W / 2, GAME_H / 2 + 280, isLastLayer ? 'Claim the Crown 👑' : 'Continue ➜', () => {
      this.scene.start(isLastLayer ? 'RunVictory' : 'Map');
    }, { width: 420 }).setDepth(31);
    dim.setInteractive(); // swallow taps under the overlay
  }

  private showDefeat(): void {
    clearSave(); // the run dies with the king
    const dim = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x2a1030, 0.72).setDepth(30);
    dim.setInteractive();
    makeTitle(this, GAME_W / 2, GAME_H / 2 - 120, 'Your King fell…', 56, COLORS.textWhite).setDepth(31);
    this.add
      .text(GAME_W / 2, GAME_H / 2 - 30, 'The run is over. 😿', {
        fontFamily: FONT, fontSize: '32px', color: '#f2d8ff',
      })
      .setOrigin(0.5)
      .setDepth(31);
    makeButton(this, GAME_W / 2, GAME_H / 2 + 120, 'Back to Menu', () => this.scene.start('Menu'), {
      color: COLORS.purple,
    }).setDepth(31);
  }

  private burst(x: number, y: number, tint: number): void {
    const emitter = this.add.particles(x, y, 'sparkle', {
      speed: { min: 60, max: 220 },
      scale: { start: 1.6, end: 0 },
      lifespan: 500,
      quantity: 18,
      tint,
      emitting: false,
    });
    emitter.setDepth(25);
    emitter.explode(18);
    this.time.delayedCall(700, () => emitter.destroy());
  }

  private floatText(x: number, y: number, label: string): void {
    const t = this.add
      .text(x, y, label, {
        fontFamily: FONT, fontSize: '30px', color: '#ffffff',
        stroke: '#d4548c', strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(26);
    this.tweens.add({
      targets: t, y: y - 60, alpha: 0, duration: 900,
      onComplete: () => t.destroy(),
    });
  }
}
