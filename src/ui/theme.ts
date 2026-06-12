export const FONT = '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif';

export const COLORS = {
  pinkDark: 0xd4548c,
  pink: 0xff7bac,
  pinkLight: 0xffd6e7,
  purple: 0x7b5cc6,
  purpleLight: 0xcdbcf2,
  cream: 0xfff4f7,
  gold: 0xf5c542,
  boardLight: 0xfde8f0,
  boardDark: 0xf6c6da,
  boardFrame: 0xc98d6b,
  textDark: '#5a3a52',
  textPink: '#d4548c',
  textWhite: '#fff7fb',
};

export const GAME_W = 720;
export const GAME_H = 1280;

interface ButtonOpts {
  width?: number;
  height?: number;
  fontSize?: number;
  color?: number;
}

/** Rounded kawaii button with a drop shadow and press feedback. */
export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  opts: ButtonOpts = {},
): Phaser.GameObjects.Container {
  const w = opts.width ?? 320;
  const h = opts.height ?? 88;
  const color = opts.color ?? COLORS.pink;

  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.15);
  g.fillRoundedRect(-w / 2 + 4, -h / 2 + 6, w, h, h / 2);
  g.fillStyle(color, 1);
  g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
  g.lineStyle(4, 0xffffff, 0.85);
  g.strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);

  const text = scene.add
    .text(0, 0, label, {
      fontFamily: FONT,
      fontSize: `${opts.fontSize ?? 34}px`,
      color: COLORS.textWhite,
    })
    .setOrigin(0.5)
    .setShadow(0, 2, 'rgba(0,0,0,0.25)', 2);

  const container = scene.add.container(x, y, [g, text]);
  container.setSize(w, h);
  container.setInteractive({ useHandCursor: true });
  container.on('pointerdown', () => container.setScale(0.94));
  container.on('pointerout', () => container.setScale(1));
  container.on('pointerup', () => {
    container.setScale(1);
    onClick();
  });
  return container;
}

/** Big bubbly title text with outline. */
export function makeTitle(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  size = 48,
  color: string | number = COLORS.textPink,
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, label, {
      fontFamily: FONT,
      fontSize: `${size}px`,
      color: typeof color === 'number' ? `#${color.toString(16)}` : color,
      stroke: '#ffffff',
      strokeThickness: Math.max(4, size / 7),
    })
    .setOrigin(0.5)
    .setShadow(0, 3, 'rgba(120,40,90,0.25)', 4);
}
