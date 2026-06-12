import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { MenuScene } from './scenes/MenuScene';
import { RunVictoryScene } from './scenes/RunVictoryScene';
import { ShopScene } from './scenes/ShopScene';
import { GAME_H, GAME_W } from './ui/theme';
import './style.css';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_W,
  height: GAME_H,
  backgroundColor: '#fff4f7',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, MapScene, BattleScene, ShopScene, RunVictoryScene],
});

// handy for debugging and automated play-testing
(window as unknown as { game: Phaser.Game }).game = game;
