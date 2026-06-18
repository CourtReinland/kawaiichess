#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const { PIECE_DEFINITIONS } = await import(resolve(root, 'src/game/pieces.ts'));
const { ACADEMY_DEFINITIONS } = await import(resolve(root, 'src/game/academies.ts'));
const { STORY_SCENES } = await import(resolve(root, 'src/game/story.ts'));

const apiKey = process.env.XAI_API_KEY;
const apiUrl = process.env.XAI_IMAGE_URL ?? 'https://api.x.ai/v1/images/generations';
const model = process.env.XAI_IMAGE_MODEL ?? 'grok-imagine-image';

const args = process.argv.slice(2);
const flags = {
  portraits: args.includes('--portraits'),
  minis: args.includes('--minis'),
  backdrops: args.includes('--backdrops'),
  scenes: args.includes('--scenes'),
  boards: args.includes('--boards'),
  all: args.includes('--all'),
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
};

if (!flags.portraits && !flags.minis && !flags.backdrops && !flags.scenes && !flags.boards) {
  flags.all = true;
}

const outDirs = {
  portraits: resolve(root, 'public/characters/portraits'),
  minis: resolve(root, 'public/characters/minis'),
  backdrops: resolve(root, 'public/academies'),
  scenes: resolve(root, 'public'),
  boards: resolve(root, 'public/academies'),
  ui: resolve(root, 'public/ui'),
};

for (const dir of Object.values(outDirs)) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function log(...msgs) {
  // eslint-disable-next-line no-console
  console.log(...msgs);
}

function warn(...msgs) {
  // eslint-disable-next-line no-console
  console.warn(...msgs);
}

function error(...msgs) {
  // eslint-disable-next-line no-console
  console.error(...msgs);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchImage(prompt, format = 'url', options = {}) {
  const body = {
    model,
    prompt,
    n: 1,
    response_format: format,
  };
  if (options.aspectRatio) {
    body.aspect_ratio = options.aspectRatio;
  }
  if (options.imageUrls && options.imageUrls.length > 0) {
    body.image_urls = options.imageUrls;
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`xAI API error ${res.status}: ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
  }

  const item = data.data?.[0];
  if (!item) {
    throw new Error(`Unexpected response shape: ${text.slice(0, 200)}`);
  }

  if (format === 'b64_json' && item.b64_json) {
    return Buffer.from(item.b64_json, 'base64');
  }

  if (item.url) {
    const imageRes = await fetch(item.url);
    if (!imageRes.ok) {
      throw new Error(`Failed to download image from ${item.url}: ${imageRes.status}`);
    }
    return Buffer.from(await imageRes.arrayBuffer());
  }

  if (item.b64_json) {
    return Buffer.from(item.b64_json, 'base64');
  }

  throw new Error(`No image url or b64_json in response: ${text.slice(0, 200)}`);
}

async function generateOne({ label, prompt, outPath, format = 'url', retries = 2, options = {} }) {
  if (!flags.force && existsSync(outPath)) {
    log(`  skip ${label} (exists)`);
    return;
  }

  if (flags.dryRun) {
    log(`  would generate ${label} -> ${outPath}`);
    return;
  }

  if (!apiKey) {
    warn(`  skip ${label}: XAI_API_KEY not set`);
    return;
  }

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      log(`  generating ${label} (attempt ${attempt + 1})...`);
      let buffer;
      try {
        buffer = await fetchImage(prompt, format, options);
      } catch (e) {
        if (format === 'url' && e.message?.includes('response_format')) {
          buffer = await fetchImage(prompt, 'b64_json', options);
        } else {
          throw e;
        }
      }
      ensureDir(outPath);
      writeFileSync(outPath, buffer);
      log(`  saved ${outPath}`);
      return;
    } catch (err) {
      lastErr = err;
      error(`    attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt < retries) await sleep(2000 * (attempt + 1));
    }
  }
  error(`  failed to generate ${label}: ${lastErr.message}`);
}

const STYLE = 'Anime visual novel style, soft cel-shading, clean lineart, vibrant colors, no text, no watermark.';
const BG_STYLE = 'Anime visual novel background, soft painted style, atmospheric lighting, no characters, no text, no watermark.';

const UNIFORM_THEME = {
  alishan: 'a cozy chapel school uniform with soft blues, white ribbons, and a tiny cross pin',
  'yami-no-gakuen': 'a gothic black-and-crimson uniform with rose accents and silver chains',
  'seishin-high': 'a serene shrine maiden uniform with red hakama, white haori, and cherry blossom ornaments',
  'candy-forest-prep': 'a pastel confectionery uniform with candy-striped ribbons and frosting-like frills',
  'thunder-samurai-institute': 'a disciplined dojo uniform with indigo hakama, lightning-crest haori, and wrapped forearms',
  'kitsune-illusion-academy': 'a whimsical fox-themed uniform with plaid, bell ornaments, and fluffy tails',
  'celestial-mage-collegium': 'an elegant midnight-blue and silver mage robe with star-thread embroidery',
  'final-boss-throne-academy': 'a regal black-and-gold uniform with a crimson cape and jeweled crown motifs',
};

const ACADEMY_THEME = {
  alishan: 'a cozy chapel-turned-clubroom with stained glass, prayer books, and warm candlelight',
  'yami-no-gakuen': 'a gothic academy hall with black candles, dark rose petals, and heavy velvet curtains',
  'seishin-high': 'a serene shrine courtyard with cherry blossoms, stone lanterns, and polished wooden floors',
  'candy-forest-prep': 'a pastel confectionery campus with candy cane arches, gingerbread rooftops, and sugar glades',
  'thunder-samurai-institute': 'a thunder-lit dojo with tatami mats, shoji screens crackling with lightning, and ancestral banners',
  'kitsune-illusion-academy': 'a whimsical forest campus with torii gates, paper lanterns, and drifting cherry blossoms',
  'celestial-mage-collegium': 'an astral observatory tower with floating star charts, silver telescopes, and midnight-blue marble',
  'final-boss-throne-academy': 'a grand throne hall with red carpets, golden chandeliers, and towering stained-glass windows',
};

function movementVisual(movement) {
  switch (movement) {
    case 'king':
    case 'jump-king':
    case 'king-plus-one':
      return 'regal crown, elegant cape';
    case 'queen':
    case 'short-queen':
      return 'queenly tiara, commanding stance';
    case 'rook':
    case 'short-rook':
      return 'towering armored sleeves, castle-themed accessories';
    case 'bishop':
    case 'bishop-range':
      return 'tall ceremonial hat, diagonal motifs';
    case 'knight':
    case 'extended-knight':
    case 'mecha-knight':
      return 'knight helmet or visor, agile pose';
    case 'pawn':
      return 'cute apprentice uniform, determined expression';
    case 'dragon':
      return 'dragon wings and tail, proud princess aura';
    default:
      return 'anime school uniform with chess-themed accessories';
  }
}

function piecePrompt(piece, kind) {
  const parts = [
    piece.name,
    piece.personality ?? '',
    piece.backstory ?? '',
    movementVisual(piece.movement),
  ];

  const uniform = piece.uniformTheme && UNIFORM_THEME[piece.uniformTheme]
    ? UNIFORM_THEME[piece.uniformTheme]
    : (piece.uniformTheme ? `${piece.uniformTheme} uniform theme` : 'cute school uniform');

  if (kind === 'portrait') {
    return `Anime visual novel character portrait of ${parts.join('. ')}. Half-body composition, expressive face, detailed eyes, ${uniform}, ${STYLE}`;
  }

  return `Tiny chibi anime game token of ${parts.join('. ')}. Super-deformed full body, standing on a round base, ${uniform}, cute pastel colors, simple cel-shaded style, white background, no text`;
}

async function generatePortraits() {
  log('\nPortraits');
  for (const piece of PIECE_DEFINITIONS) {
    if (!piece.portraitImage) continue;
    await generateOne({
      label: `${piece.name} portrait`,
      prompt: piecePrompt(piece, 'portrait'),
      outPath: resolve(outDirs.portraits, piece.portraitImage),
    });
  }
}

async function generateMinis() {
  log('\nMinis');
  for (const piece of PIECE_DEFINITIONS) {
    if (!piece.miniImage) continue;
    await generateOne({
      label: `${piece.name} mini`,
      prompt: piecePrompt(piece, 'mini'),
      outPath: resolve(outDirs.minis, piece.miniImage),
    });
  }
}

async function generateBackdrops() {
  log('\nAcademy backdrops');
  for (const academy of ACADEMY_DEFINITIONS) {
    if (!academy.backdropImage) continue;
    const theme = ACADEMY_THEME[academy.id] ?? `a themed academy campus for ${academy.name}`;
    await generateOne({
      label: `${academy.name} backdrop`,
      prompt: `${academy.name}. ${academy.flavorText ?? ''} ${theme}. ${BG_STYLE}`,
      outPath: resolve(outDirs.backdrops, academy.backdropImage),
    });
  }
}

function scenePrompt(academy, sceneId, context) {
  const theme = ACADEMY_THEME[academy.id] ?? `the campus of ${academy.name}`;
  const mood = context === 'intro' ? 'tense, competitive atmosphere before a match' : 'emotional aftermath of a magical chess battle';
  return `${academy.name} ${context} scene. ${theme}. ${academy.flavorText ?? ''} ${mood}. ${BG_STYLE}`;
}

function dataUriForCrest(crestImage) {
  const path = resolve(root, 'public/academies', crestImage);
  if (!existsSync(path)) return undefined;
  const ext = crestImage.endsWith('.png') ? 'png' : 'jpeg';
  const b64 = readFileSync(path).toString('base64');
  return `data:image/${ext};base64,${b64}`;
}

function boardPrompt(academy) {
  const theme = ACADEMY_THEME[academy.id] ?? `the campus of ${academy.name}`;
  return `Top-down view of a magical 8x8 chess board for ${academy.name}. ${theme}. The board surface is ornate and thematic, with a subtle checkerboard pattern, the academy's crest softly glowing in the center, and decorative edges that match the school's colors. Anime visual novel style, soft painted texture, atmospheric lighting, no characters, no text, no watermark.`;
}

async function generateBoards() {
  log('\nAcademy board textures');
  for (const academy of ACADEMY_DEFINITIONS) {
    const outPath = resolve(outDirs.boards, `${academy.id}-board.jpg`);
    const crestRef = dataUriForCrest(academy.crestImage);
    await generateOne({
      label: `${academy.name} board texture`,
      prompt: boardPrompt(academy),
      outPath,
      options: {
        aspectRatio: '1:1',
        imageUrls: crestRef ? [crestRef] : undefined,
      },
    });
  }
}

async function generateScenes() {
  log('\nStory scenes');
  const introOutroRe = /^((?:intro|outro)-(?:victory-|defeat-)?)(.+?)(?:-(victory|defeat))?$/;

  for (const [sceneId, scene] of Object.entries(STORY_SCENES)) {
    if (sceneId === 'start-prologue') {
      await generateOne({
        label: 'start-screen',
        prompt: `Anime visual novel title screen background for "Kawaii Chess Academy". A tiny chapel school at sunset, cherry blossoms, glowing chess pieces floating in the sky, magical sparkles. ${BG_STYLE}`,
        outPath: resolve(outDirs.ui, 'start-screen.jpg'),
      });
      continue;
    }

    if (sceneId.startsWith('kira-taunt')) {
      await generateOne({
        label: sceneId,
        prompt: `Anime visual novel background of a tournament grounds courtyard at sunset, rival school flags, cherry blossom petals falling, stone pathways, dramatic golden lighting, no characters, no text. ${BG_STYLE}`,
        outPath: resolve(outDirs.scenes, scene.backgroundImage),
      });
      continue;
    }

    const match = sceneId.match(introOutroRe);
    const context = match?.[1]?.replace(/-$/, '') ?? 'scene';
    const academyId = match?.[2];
    const academy = ACADEMY_DEFINITIONS.find((a) => a.id === academyId);
    if (!academy) {
      warn(`  unknown academy for scene ${sceneId}`);
      continue;
    }

    await generateOne({
      label: sceneId,
      prompt: scenePrompt(academy, sceneId, context),
      outPath: resolve(outDirs.scenes, scene.backgroundImage),
    });
  }
}

async function main() {
  if (!flags.dryRun && !apiKey) {
    warn('XAI_API_KEY is not set. Run with --dry-run to see prompts, or set the key to generate images.');
  }

  log('KawaiiChess asset generator');
  log(`Model: ${model}`);
  log(`Targets: ${flags.all ? 'all' : Object.keys(flags).filter((k) => flags[k] && k !== 'all' && k !== 'force' && k !== 'dryRun').join(', ')}`);

  if (flags.all || flags.portraits) await generatePortraits();
  if (flags.all || flags.minis) await generateMinis();
  if (flags.all || flags.backdrops) await generateBackdrops();
  if (flags.all || flags.boards) await generateBoards();
  if (flags.all || flags.scenes) await generateScenes();

  log('\nDone.');
}

main().catch((err) => {
  error(err);
  process.exit(1);
});
