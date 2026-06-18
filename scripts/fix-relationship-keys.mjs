import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const piecesPath = resolve(__dirname, '../src/game/pieces.ts');

let source = readFileSync(piecesPath, 'utf-8');

// Fix unquoted relationship keys inside relationships: { ... } blocks.
// Match lines that look like `    key: '...',` within a relationships block.
const relationshipKeyRegex = /(relationships:\s*\{[\s\S]*?)(\n\s+)([a-z][a-z0-9-]*):\s*'/g;

source = source.replace(relationshipKeyRegex, (match, prefix, indent, key) => {
  return `${prefix}${indent}'${key}': '`;
});

writeFileSync(piecesPath, source, 'utf-8');
console.log('Fixed relationship keys.');
