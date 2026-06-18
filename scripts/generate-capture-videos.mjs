#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const { PIECE_BY_ID } = await import(resolve(root, 'src/game/pieces.ts'));

const apiKey = process.env.XAI_API_KEY;
const imageModel = process.env.XAI_IMAGE_MODEL ?? 'grok-imagine-image-quality';
const videoModel = process.env.XAI_VIDEO_MODEL ?? 'grok-imagine-video';
const imageUrl = process.env.XAI_IMAGE_URL ?? 'https://api.x.ai/v1/images/generations';
const videoUrl = process.env.XAI_VIDEO_URL ?? 'https://api.x.ai/v1/videos/generations';
const videoStatusUrl = (id) => `https://api.x.ai/v1/videos/${id}`;

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');

const matchIndex = args.findIndex((a) => a === '--match');
const matchAcademyId = matchIndex >= 0 ? args[matchIndex + 1] : 'seishin-high';

const outDir = resolve(root, 'public/videos/captures');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

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

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${options.method ?? 'GET'} ${url} failed ${res.status}: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text);
}

function dataUriForPortrait(portraitImage) {
  const path = resolve(root, 'public/characters/portraits', portraitImage);
  if (!existsSync(path)) {
    throw new Error(`Portrait not found: ${path}`);
  }
  const ext = portraitImage.endsWith('.png') ? 'png' : 'jpeg';
  const b64 = readFileSync(path).toString('base64');
  return `data:image/${ext};base64,${b64}`;
}

async function generateActionImage(attacker, defender) {
  const attackerRef = dataUriForPortrait(attacker.portraitImage);
  const defenderRef = defender.portraitImage ? dataUriForPortrait(defender.portraitImage) : attackerRef;

  const prompt = `Anime action scene on a magical chess board. ${attacker.name} attacks and captures ${defender.name}. Use the first reference image as the exact face, hair, and uniform of ${attacker.name}. Use the second reference image as the exact face, hair, and uniform of ${defender.name}. Dynamic motion, dramatic impact, no text, no watermark.`;

  const data = await fetchJson(imageUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: imageModel,
      prompt,
      image_urls: [attackerRef, defenderRef],
      n: 1,
      response_format: 'url',
    }),
  });
  return data.data[0].url;
}

async function submitVideo(imageUrlValue, attacker, defender) {
  const prompt = `Animate this action scene: ${attacker.name} strikes ${defender.name} in a dramatic finishing move, capturing them on a magical chess board. Cinematic motion, impact, 2 seconds.`;
  const data = await fetchJson(videoUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: videoModel, image_url: imageUrlValue, prompt, duration: 2 }),
  });
  return data.request_id;
}

async function pollVideo(requestId, retries = 60) {
  for (let i = 0; i < retries; i++) {
    const data = await fetchJson(videoStatusUrl(requestId), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (data.status === 'done') return data.video.url;
    if (data.status === 'failed' || data.status === 'expired') {
      throw new Error(`Video generation ${data.status}: ${JSON.stringify(data)}`);
    }
    log(`    video ${requestId} status: ${data.status ?? 'pending'} (${i + 1}/${retries})`);
    await sleep(5000);
  }
  throw new Error(`Video generation timed out: ${requestId}`);
}

async function downloadVideo(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buffer);
}

async function generatePair(attackerId, defenderId) {
  const attacker = PIECE_BY_ID[attackerId];
  const defender = PIECE_BY_ID[defenderId];
  if (!attacker || !defender) {
    warn(`  skip ${attackerId}-captures-${defenderId}: missing definition`);
    return;
  }

  if (!attacker.portraitImage || !defender.portraitImage) {
    warn(`  skip ${attackerId}-captures-${defenderId}: missing portrait reference`);
    return;
  }

  const filename = `${attackerId}-captures-${defenderId}.mp4`;
  const outPath = resolve(outDir, filename);

  if (!force && existsSync(outPath)) {
    log(`  skip ${filename} (exists)`);
    return;
  }

  if (dryRun) {
    log(`  would generate ${filename}`);
    return;
  }

  if (!apiKey) {
    warn(`  skip ${filename}: XAI_API_KEY not set`);
    return;
  }

  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      log(`  generating ${filename} (attempt ${attempt + 1})...`);
      const image = await generateActionImage(attacker, defender);
      log(`    image: ${image}`);
      const requestId = await submitVideo(image, attacker, defender);
      log(`    video request: ${requestId}`);
      const video = await pollVideo(requestId);
      await downloadVideo(video, outPath);
      log(`    saved ${outPath}`);
      return;
    } catch (err) {
      lastErr = err;
      error(`    attempt ${attempt + 1} failed: ${err.message}`);
      await sleep(5000 * (attempt + 1));
    }
  }
  error(`  failed to generate ${filename}: ${lastErr.message}`);
}

const MATCHUP = {
  'seishin-high': {
    player: ['king', 'magical-girl-rook', 'ninja-knight', 'idol-bishop', 'schoolgirl-pawn'],
    enemy: ['seishin-king', 'seishin-bishop', 'seishin-pawn'],
  },
};

async function main() {
  if (!dryRun && !apiKey) {
    warn('XAI_API_KEY is not set. Set it or run with --dry-run.');
    process.exit(1);
  }

  const matchup = MATCHUP[matchAcademyId];
  if (!matchup) {
    error(`Unknown match academy: ${matchAcademyId}`);
    process.exit(1);
  }

  const pairs = [];
  for (const attacker of matchup.player) {
    for (const defender of matchup.enemy) {
      pairs.push([attacker, defender]);
    }
  }
  for (const attacker of matchup.enemy) {
    for (const defender of matchup.player) {
      pairs.push([attacker, defender]);
    }
  }

  log(`Generating ${pairs.length} capture videos for ${matchAcademyId}...`);
  log(`Image model: ${imageModel}`);
  log(`Video model: ${videoModel}`);
  log(`Output: ${outDir}`);
  for (const [attackerId, defenderId] of pairs) {
    await generatePair(attackerId, defenderId);
  }
  log('\nDone.');
}

main().catch((err) => {
  error(err);
  process.exit(1);
});
