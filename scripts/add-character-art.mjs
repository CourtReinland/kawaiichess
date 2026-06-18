import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const piecesPath = resolve(__dirname, '../src/game/pieces.ts');

const artData = {
  king: {
    portraitImage: 'hana-portrait.png',
    miniImage: 'hana-mini.png',
    backstory:
      'Hana is the soft-spoken captain of Alishan Academy\'s chess club. She was never the strongest player, but her ability to keep the team calm under pressure turned a group of misfits into regional contenders.',
    relationships: {
      queen: 'Mira is Hana\'s vice-captain and the only person allowed to tease her about her terrible opening theory.',
      'final-boss-queen': 'Kira was Hana\'s childhood best friend before a falling-out over a tournament slot. Their reunion is equal parts bitter and heartbreaking.',
      'thunder-samurai': 'Ren keeps challenging Hana to unofficial blitz matches. She suspects he\'s flirting; he insists it\'s "respect."',
    },
  },
  queen: {
    portraitImage: 'mira-portrait.png',
    miniImage: 'mira-mini.png',
    backstory:
      'Mira is Alishan\'s tactical prodigy—a scholarship student from a rival district who transferred in after losing to Hana in a middle-school qualifier. She claims she stayed for the free chapel lunches.',
    relationships: {
      king: 'Mira respects Hana\'s leadership more than she admits, and quietly rewrites every opening to suit her captain\'s style.',
      'celestial-mage': 'Luna once offered Mira a spot at Celestial Mage Collegium. Mira declined, but the offer still haunts her on bad nights.',
    },
  },
  'magical-girl-rook': {
    portraitImage: 'magical-girl-rook-portrait.png',
    miniImage: 'magical-girl-rook-mini.png',
    backstory:
      'A transferred magical-girl fan who joined the chess club because the barrier magic classes conflicted with choir. She treats every pawn push like a transformation sequence.',
  },
  'ninja-knight': {
    portraitImage: 'ninja-knight-portrait.png',
    miniImage: 'ninja-knight-mini.png',
    backstory:
      'The club\'s silent enforcer. No one knows his real name, but he once shadow-stepped across three tables to catch a falling king.',
  },
  'idol-bishop': {
    portraitImage: 'idol-bishop-portrait.png',
    miniImage: 'idol-bishop-mini.png',
    backstory:
      'An aspiring school idol who accidentally joined the chess club thinking it was the "cheer club." She stayed when she realized bishops move diagonally "like dance formations."',
  },
  'dragon-princess': {
    portraitImage: 'dragon-princess-portrait.png',
    miniImage: 'dragon-princess-mini.png',
    backstory:
      'A first-year noble who insists she will "promote to greatness" by the end of the tournament. Her pride is matched only by her surprising kindness to pawns.',
  },
  'shrine-maiden': {
    portraitImage: 'sakura-portrait.png',
    miniImage: 'sakura-mini.png',
    backstory:
      'Sakura captains Seishin High\'s shrine chess team. She sees the board as a sacred space and treats every match as a purification ritual between schools.',
    relationships: {
      king: 'Sakura finds Hana\'s earnest prayers familiar and a little dangerous—too much faith can make a player predictable.',
    },
  },
  'schoolgirl-pawn': {
    portraitImage: 'schoolgirl-pawn-portrait.png',
    miniImage: 'schoolgirl-pawn-mini.png',
    backstory:
      'The most junior member of Alishan\'s club. She studies openings every night and dreams of promotion—not just on the board, but into someone the team can rely on.',
  },
  'sakura-assassin': {
    portraitImage: 'sakura-assassin-portrait.png',
    miniImage: 'sakura-assassin-mini.png',
    backstory:
      'A third-year from an unaffiliated dojo who enters the tournament as a ringer. She says she fights alone, but keeps glancing at Alishan\'s bench.',
  },
  'celestial-mage': {
    portraitImage: 'luna-portrait.png',
    miniImage: 'luna-mini.png',
    backstory:
      'Luna is the top strategist of Celestial Mage Collegium. She reads star charts before every match and genuinely believes the universe has already decided the winner.',
    relationships: {
      queen: 'Luna still considers Mira her greatest "what if"—a rival who chose faith over astrology.',
    },
  },
  'valkyrie-paladin': {
    portraitImage: 'valkyrie-paladin-portrait.png',
    miniImage: 'valkyrie-paladin-mini.png',
    backstory:
      'A defender from Celestial Mage Collegium who transferred mid-season to "protect someone worth protecting." She refuses to say who.',
  },
  'kitsune-trickster': {
    portraitImage: 'yuki-portrait.png',
    miniImage: 'yuki-mini.png',
    backstory:
      'Yuki is Kitsune Illusion Academy\'s star trickster. She flirts with opponents to unsettle them, but her grin slips whenever someone sees through an illusion cleanly.',
    relationships: {
      king: 'Yuki calls Hana "prayer-chan" and claims it\'s just teasing. It might be more.',
    },
  },
  'thunder-samurai': {
    portraitImage: 'ren-portrait.png',
    miniImage: 'ren-mini.png',
    backstory:
      'Ren is Thunder Samurai Institute\'s ace and loudest voice. He values honor above all else, which makes his growing crush on a prayer-school captain extremely inconvenient.',
    relationships: {
      king: 'Ren respects Hana\'s calm under pressure and keeps inventing excuses to face her in practice matches.',
    },
  },
  'candy-witch': {
    portraitImage: 'candy-portrait.png',
    miniImage: 'candy-mini.png',
    backstory:
      'Candy is the captain of Candy Forest Prep\'s "Confectionery Combat Club." She decorates the board like a dessert and traps like a spider with a sweet tooth.',
  },
  'forest-archer': {
    portraitImage: 'forest-archer-portrait.png',
    miniImage: 'forest-archer-mini.png',
    backstory:
      'A calm ranger from the countryside who joined the tournament to prove that patience beats flash. She never raises her voice, even when winning.',
  },
  'pop-star': {
    portraitImage: 'pop-star-portrait.png',
    miniImage: 'pop-star-mini.png',
    backstory:
      'A chart-topping school idol who treats every match as a live performance. Her charm skill can literally make opposing pieces skip a turn.',
  },
  'eternal-queen': {
    portraitImage: 'eternal-queen-portrait.png',
    miniImage: 'eternal-queen-mini.png',
    backstory:
      'The student council president of an elite academy, rumored to have once rewound an entire match to save a friend. No one can prove it.',
  },
  'moonlight-reaper': {
    portraitImage: 'moonlight-reaper-portrait.png',
    miniImage: 'moonlight-reaper-mini.png',
    backstory:
      'A lone striker who grows stronger as allies fall. Some say she\'s cursed; she says she\'s just used to being the last one standing.',
  },
  'void-princess': {
    portraitImage: 'void-princess-portrait.png',
    miniImage: 'void-princess-mini.png',
    backstory:
      'Aloof royalty from Final Boss Throne Academy who can banish pieces from the board. She finds most opponents "not worth the void."',
  },
  'demon-queen': {
    portraitImage: 'victoria-portrait.png',
    miniImage: 'victoria-mini.png',
    backstory:
      'Victoria is the reigning national champion and final boss of the tournament. Three years ago she was a prayer-school hopeful like Hana, before disappointment burned every softness away.',
    relationships: {
      king: 'Victoria sees too much of her younger self in Hana and hates her for it.',
    },
  },
  'final-boss-queen': {
    portraitImage: 'kira-portrait.png',
    miniImage: 'kira-mini.png',
    backstory:
      'Kira captains Yami no Gakuen and serves as the tournament\'s opening gatekeeper. She was Hana\'s closest friend until a single tournament slot drove them apart.',
    relationships: {
      king: 'Kira wants Hana to suffer almost as much as she wants Hana to prove her wrong.',
    },
  },
  rook: {
    portraitImage: 'rook-club-portrait.png',
    miniImage: 'rook-mini.png',
    backstory: 'A dependable club member who dominates straight lines and straight talk.',
  },
  bishop: {
    portraitImage: 'bishop-club-portrait.png',
    miniImage: 'bishop-mini.png',
    backstory: 'A quiet strategist who prefers diagonal thinking and early-morning practice.',
  },
  knight: {
    portraitImage: 'knight-club-portrait.png',
    miniImage: 'knight-mini.png',
    backstory: 'The team\'s energetic charger who leaps over problems and asks questions later.',
  },
  pawn: {
    portraitImage: 'pawn-club-portrait.png',
    miniImage: 'pawn-mini.png',
    backstory: 'A humble first-year who dreams of promotion and never misses cleanup duty.',
  },
};

let source = readFileSync(piecesPath, 'utf-8');

for (const [id, data] of Object.entries(artData)) {
  const blockRegex = new RegExp(`(id: ['"]${id}['"],[\\s\\S]*?flavorQuote:[\\s\\S]*?['"].*?['"],?\\s*$)`, 'm');
  const match = source.match(blockRegex);
  if (!match) {
    console.warn(`Could not find block for ${id}`);
    continue;
  }

  const fields = [];
  if (data.portraitImage) fields.push(`portraitImage: '${data.portraitImage}'`);
  if (data.miniImage) fields.push(`miniImage: '${data.miniImage}'`);
  if (data.backstory) fields.push(`backstory: '${data.backstory.replace(/'/g, "\\'")}'`);
  if (data.relationships) {
    const relEntries = Object.entries(data.relationships)
      .map(([key, val]) => `'${key}': '${val.replace(/'/g, "\\'")}'`)
      .join(',\n    ');
    fields.push(`relationships: {\n    ${relEntries}\n  }`);
  }

  if (fields.length === 0) continue;

  const replacement = `${match[1]}\n  ${fields.join(',\n  ')},`;
  source = source.replace(match[0], replacement);
}

writeFileSync(piecesPath, source, 'utf-8');
console.log(`Injected character art data into ${Object.keys(artData).length} pieces.`);
