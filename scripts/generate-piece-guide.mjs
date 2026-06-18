import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const piecesPath = resolve(__dirname, '../src/game/pieces.ts');
const outputPath = resolve(__dirname, '../piece-guide.html');

const raw = readFileSync(piecesPath, 'utf-8');

function extractString(value) {
  const match = value.match(/['"](.*?)['"]/);
  return match ? match[1] : value.trim();
}

function extractNumber(value) {
  const match = value.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

function extractBoolean(value) {
  return value.trim() === 'true';
}

function parseAbility(block) {
  const abilityMatch = block.match(/ability:\s*\{([\s\S]*?)\n\s*\},?/);
  if (!abilityMatch) return undefined;
  const inner = abilityMatch[1];
  const ability = {};
  for (const line of inner.split('\n')) {
    const match = line.match(/^\s*(\w+):\s*(.+?),?\s*$/);
    if (!match) continue;
    const [, key, val] = match;
    if (key === 'name' || key === 'description' || key === 'trigger') {
      ability[key] = extractString(val);
    } else if (key === 'uses' || key === 'range') {
      ability[key] = extractNumber(val);
    }
  }
  return ability;
}

// Extract top-level objects from the PIECE_DEFINITIONS array using brace counting.
const arrayStart = raw.indexOf('export const PIECE_DEFINITIONS: PieceDefinition[] = [');
if (arrayStart === -1) {
  console.error('Could not find PIECE_DEFINITIONS array');
  process.exit(1);
}
let braceStart = raw.indexOf('[', arrayStart) + 1;
let braceCount = 0;
let inString = false;
let stringChar = '';
const blocks = [];
let currentBlockStart = -1;

for (let i = braceStart; i < raw.length; i++) {
  const ch = raw[i];
  const prev = raw[i - 1];

  if (inString) {
    if (ch === stringChar && prev !== '\\') {
      inString = false;
    }
    continue;
  }

  if (ch === '"' || ch === "'") {
    inString = true;
    stringChar = ch;
    continue;
  }

  if (ch === '{') {
    if (braceCount === 0) {
      currentBlockStart = i;
    }
    braceCount++;
  } else if (ch === '}') {
    braceCount--;
    if (braceCount === 0 && currentBlockStart !== -1) {
      blocks.push(raw.slice(currentBlockStart, i + 1));
      currentBlockStart = -1;
    }
  }
}

const pieces = [];

for (const block of blocks) {
  const idMatch = block.match(/id:\s*(['"].*?['"]),/);
  const nameMatch = block.match(/name:\s*(['"].*?['"]),/);
  const tierMatch = block.match(/tier:\s*(\d+)/);
  const categoryMatch = block.match(/category:\s*(['"].*?['"]),/);
  const movementMatch = block.match(/movement:\s*(['"].*?['"]),/);
  const iconMatch = block.match(/icon:\s*(['"].*?['"]),?/);

  if (!idMatch || !nameMatch || !tierMatch || !categoryMatch || !movementMatch || !iconMatch) {
    console.error('Skipping malformed block:', block.slice(0, 200));
    continue;
  }

  const id = extractString(idMatch[1]);
  const name = extractString(nameMatch[1]);
  const tier = extractNumber(tierMatch[1]);
  const category = extractString(categoryMatch[1]);
  const movement = extractString(movementMatch[1]);
  const icon = extractString(iconMatch[1]);

  const blockBeforeAbility = block.split('ability:')[0];
  const range = blockBeforeAbility.includes('range:')
    ? extractNumber(blockBeforeAbility.match(/range:\s*(\d+)/)[1])
    : undefined;
  const canJump = block.includes('canJump:') ? extractBoolean(block.match(/canJump:\s*(true|false)/)[1]) : false;
  const isRoyal = block.includes('isRoyal:') ? extractBoolean(block.match(/isRoyal:\s*(true|false)/)[1]) : false;
  const promotionTarget = block.includes('promotionTarget:')
    ? extractString(block.match(/promotionTarget:\s*(['"].*?['"]),/)[1])
    : undefined;
  const personality = block.includes('personality:')
    ? extractString(block.match(/personality:\s*(['"].*?['"]),?/)[1])
    : undefined;
  const flavorQuote = block.includes('flavorQuote:')
    ? extractString(block.match(/flavorQuote:\s*(['"].*?['"]),?/)[1])
    : undefined;
  const ability = parseAbility(block);

  pieces.push({
    id,
    name,
    tier,
    category,
    movement,
    range,
    canJump,
    isRoyal,
    promotionTarget,
    icon,
    personality,
    flavorQuote,
    ability,
  });
}

function abilityHtml(ability) {
  if (!ability) return '<em>No active ability.</em>';
  const uses = ability.uses ? `(${ability.uses} use${ability.uses > 1 ? 's' : ''})` : '';
  const range = ability.range ? `Range ${ability.range}` : '';
  const trigger = ability.trigger ? `<span class="tag">${ability.trigger}</span>` : '';
  return `
    <div class="ability">
      <strong>${ability.name}</strong> ${trigger} ${uses} ${range}
      <p>${ability.description}</p>
    </div>
  `;
}

function movementHtml(piece) {
  const parts = [piece.movement];
  if (piece.range) parts.push(`range ${piece.range}`);
  if (piece.canJump) parts.push('jumps pieces');
  if (piece.isRoyal) parts.push('ROYAL');
  if (piece.promotionTarget) parts.push(`promotes to ${piece.promotionTarget}`);
  return parts.join(' • ');
}

function tierLabel(tier) {
  if (tier === 1) return 'Tier 1 — Common';
  if (tier === 2) return 'Tier 2 — Specialized';
  return 'Tier 3 — Rare & Legendary';
}

const byTier = { 1: [], 2: [], 3: [] };
for (const piece of pieces) {
  byTier[piece.tier].push(piece);
}

const sections = [1, 2, 3]
  .map(
    (tier) => `
    <section id="tier-${tier}">
      <h2>${tierLabel(tier)}</h2>
      <div class="grid">
        ${byTier[tier]
          .map(
            (p) => `
          <article class="card">
            <div class="header">
              <span class="icon">${p.icon}</span>
              <div>
                <h3>${p.name}</h3>
                <span class="category">${p.category}</span>
              </div>
            </div>
            ${p.personality ? `<p class="personality">${p.personality}</p>` : ''}
            ${p.flavorQuote ? `<p class="quote">${p.flavorQuote}</p>` : ''}
            <p class="movement"><strong>Moves:</strong> ${movementHtml(p)}</p>
            ${abilityHtml(p.ability)}
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `,
  )
  .join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kawaii Chess — Piece Guide</title>
  <style>
    :root {
      --bg: #fff0f5;
      --panel: #ffffff;
      --primary: #ff69b4;
      --primary-dark: #d1478c;
      --accent: #87ceeb;
      --text: #4a2c3a;
      --light-text: #8a6a7a;
      --shadow: 0 4px 12px rgba(74, 44, 58, 0.12);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, var(--bg) 0%, #e6f7ff 100%);
      color: var(--text);
      padding: 24px;
    }
    header {
      max-width: 1000px;
      margin: 0 auto 24px;
      text-align: center;
    }
    h1 {
      margin: 0;
      color: var(--primary-dark);
      font-size: 2rem;
    }
    p.subtitle {
      margin: 8px 0 0;
      color: var(--light-text);
    }
    nav {
      max-width: 1000px;
      margin: 0 auto 24px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
    nav a {
      background: var(--panel);
      color: var(--text);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 999px;
      box-shadow: var(--shadow);
      font-weight: 600;
    }
    nav a:hover {
      background: var(--primary);
      color: white;
    }
    section {
      max-width: 1000px;
      margin: 0 auto 32px;
    }
    section h2 {
      color: var(--primary-dark);
      margin-bottom: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--panel);
      border-radius: 16px;
      padding: 16px;
      box-shadow: var(--shadow);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .icon {
      font-size: 2.5rem;
      line-height: 1;
    }
    .header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--primary-dark);
    }
    .category {
      font-size: 0.8rem;
      color: var(--light-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .personality {
      font-style: italic;
      color: var(--light-text);
      margin: 0 0 12px;
    }
    .movement, .ability {
      font-size: 0.9rem;
      margin: 8px 0 0;
    }
    .quote {
      font-weight: 600;
      color: var(--primary-dark);
      margin: 8px 0;
    }
    .ability strong {
      color: var(--primary-dark);
    }
    .ability p {
      margin: 4px 0 0;
    }
    .tag {
      display: inline-block;
      background: var(--accent);
      color: var(--text);
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      font-weight: 700;
    }
    footer {
      text-align: center;
      color: var(--light-text);
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <header>
    <h1>🎀 Kawaii Chess Academy Roster</h1>
    <p class="subtitle">Every club member, ability, personality, and icon in one place.</p>
  </header>
  <nav>
    <a href="#tier-1">Tier 1 — Common</a>
    <a href="#tier-2">Tier 2 — Specialized</a>
    <a href="#tier-3">Tier 3 — Legendary</a>
  </nav>
  <main>
    ${sections}
  </main>
  <footer>
    <p>${pieces.length} pieces total • generated from src/game/pieces.ts</p>
  </footer>
</body>
</html>
`;

writeFileSync(outputPath, html, 'utf-8');
console.log(`Wrote piece guide with ${pieces.length} pieces to ${outputPath}`);
