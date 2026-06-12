import Phaser from 'phaser';
import type { MapNode, Run } from '../core/run';
import { saveRun } from '../core/save';
import { COLORS, FONT, GAME_H, GAME_W, makeTitle } from '../ui/theme';
import { coverFit } from './MenuScene';

const NODE_ICON: Record<MapNode['type'], string> = {
  battle: '⚔️',
  elite: '🔥',
  shop: '🛍️',
  boss: '👑',
};

const NODE_LABEL: Record<MapNode['type'], string> = {
  battle: 'Battle',
  elite: 'Elite',
  shop: 'Shop',
  boss: 'BOSS',
};

export class MapScene extends Phaser.Scene {
  constructor() {
    super('Map');
  }

  create(): void {
    const run = this.registry.get('run') as Run;
    saveRun(run); // checkpoint: arriving at the map in any state
    const bg = this.add.image(GAME_W / 2, GAME_H / 2, 'bg_table');
    coverFit(bg);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xfff4f7, 0.62);

    makeTitle(this, GAME_W / 2, 90, 'Adventure Map', 52);
    this.add
      .text(GAME_W / 2, 152, `💰 ${run.gold} gold   ·   👥 ${run.army.length} pieces`, {
        fontFamily: FONT, fontSize: '28px', color: COLORS.textDark,
      })
      .setOrigin(0.5);

    // layers drawn bottom (layer 0) to top (boss)
    const layerY = (layer: number) =>
      GAME_H - 220 - layer * ((GAME_H - 480) / (run.layers.length - 1));

    // connecting paths
    const path = this.add.graphics();
    path.lineStyle(6, COLORS.pink, 0.35);
    for (let l = 0; l < run.layers.length - 1; l++) {
      for (const a of run.layers[l]) {
        for (const b of run.layers[l + 1]) {
          path.lineBetween(
            nodeX(a, run), layerY(l),
            nodeX(b, run), layerY(l + 1),
          );
        }
      }
    }

    for (const layer of run.layers) {
      for (const node of layer) {
        this.drawNode(run, node, nodeX(node, run), layerY(node.layer));
      }
    }
  }

  private drawNode(run: Run, node: MapNode, x: number, y: number): void {
    const isCurrent = node.layer === run.layer;
    const isPast = node.layer < run.layer;
    const wasChosen = isPast && run.chosen[node.layer] === node.index;

    const radius = node.type === 'boss' ? 66 : 52;
    const fill = wasChosen ? COLORS.gold : isCurrent ? COLORS.pink : COLORS.pinkLight;
    const alpha = isPast && !wasChosen ? 0.35 : 1;

    const circle = this.add.circle(x, y, radius, fill, alpha).setStrokeStyle(5, 0xffffff, 0.9);
    const icon = this.add
      .text(x, y - 6, NODE_ICON[node.type], { fontSize: `${radius - 8}px` })
      .setOrigin(0.5)
      .setAlpha(alpha);
    this.add
      .text(x, y + radius + 22, NODE_LABEL[node.type], {
        fontFamily: FONT, fontSize: '24px',
        color: isCurrent ? COLORS.textPink : COLORS.textDark,
      })
      .setOrigin(0.5)
      .setAlpha(alpha);

    if (isCurrent) {
      this.tweens.add({
        targets: [circle, icon],
        scale: 1.12,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      circle.setInteractive({ useHandCursor: true });
      circle.on('pointerup', () => {
        this.registry.set('node', node);
        if (node.type === 'shop') {
          run.rollShop();
          this.scene.start('Shop');
        } else {
          this.scene.start('Battle');
        }
      });
    }
  }
}

function nodeX(node: MapNode, run: Run): number {
  const count = run.layers[node.layer].length;
  return count === 1 ? GAME_W / 2 : GAME_W / 2 + (node.index - 0.5) * 280;
}
