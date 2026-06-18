import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const piecesPath = resolve(__dirname, '../src/game/pieces.ts');

const personalities = {
  'magical-girl-rook': {
    personality: 'Stoic student-council vice president who defends the club room with dramatic barrier magic.',
    quote: '"No one bullies my teammates on my watch! Barrier, deploy!"',
  },
  'ninja-knight': {
    personality: 'Silent transfer student who appears in a puff of smoke and vanishes before roll call.',
    quote: '"You can\'t check what you can\'t see."',
  },
  'idol-bishop': {
    personality: 'Cheerful campus idol whose chants buff allies and draw crowds at culture festivals.',
    quote: '"Everyone, cheer with me—range up!"',
  },
  'dragon-princess': {
    personality: 'Proud royal who joined the club to prove she can rise from kōhai to queen.',
    quote: '"Just you wait—by the far rank, I\'ll be unstoppable!"',
  },
  'shrine-maiden': {
    personality: 'Gentle purifier who cleanses curses, offers tea, and never misses morning practice.',
    quote: '"A calm board is a clean board. Purify!"',
  },
  'schoolgirl-pawn': {
    personality: 'Eager first-year who studies openings every night and dreams of promotion.',
    quote: '"One step at a time… I\'ll make senpai proud!"',
  },
  'maid-knight': {
    personality: 'Polished and precise; tidies the board while sweeping enemies aside.',
    quote: '"Leave the cleaning—and the checkmate—to me."',
  },
  'tennis-bishop': {
    personality: 'Energetic sports-club ace who volleys pieces around with a wicked backhand.',
    quote: '"Backhand down the diagonal—ace!"',
  },
  'bookworm-rook': {
    personality: 'Quiet strategist who takes notes and gets stronger with every capture.',
    quote: '"According to my notes, you\'re already losing."',
  },
  'catgirl-pawn': {
    personality: 'Playful and unpredictable; pounces forward then naps on the clock.',
    quote: '"Nyaa~ I\'m not lazy, I\'m charging my attack!"',
  },
  cheerleader: {
    personality: 'Loud, peppy, and convinced shouting helps allies hit harder.',
    quote: '"Gimme a C! Gimme an H! Gimme your king!"',
  },
  'piano-bishop': {
    personality: 'Dramatic composer whose melodies stun foes mid-step.',
    quote: '"Listen to this crescendo… and freeze."',
  },
  'library-assistant': {
    personality: 'Shy but clever; swaps places when nobody is looking.',
    quote: '"Shh… I\'m just reshelving this piece."',
  },
  'track-star': {
    personality: 'Always sprinting; out of breath but out of reach.',
    quote: '"I\'ll lap you before you finish thinking."',
  },
  baker: {
    personality: 'Warm-hearted healer armed with fresh bread and hugs.',
    quote: '"Have a loaf, heal up, and let\'s win this!"',
  },
  'sakura-assassin': {
    personality: 'Elegant third-year who dances from target to target under falling petals.',
    quote: '"Blossom, fall, strike—three moves, one ko."',
  },
  'celestial-mage': {
    personality: 'Mysterious stargazer who bends space for a better angle.',
    quote: '"The stars aligned… right behind your king."',
  },
  'valkyrie-paladin': {
    personality: 'Noble guardian who shields allies with radiant wings.',
    quote: '"Stand behind me. No one falls today."',
  },
  'kitsune-trickster': {
    personality: 'Mischievous fox spirit who swaps places just for fun.',
    quote: '"Now I\'m here, now I\'m there—bet you can\'t keep up!"',
  },
  'thunder-samurai': {
    personality: 'Honor-bound warrior who dashes through lines in a flash.',
    quote: '"My rook line is the path of thunder."',
  },
  'candy-witch': {
    personality: 'Sweet-toothed sorceress who leaves sticky traps everywhere.',
    quote: '"Try to move through this. It\'s sugar-free… but deadly."',
  },
  'mecha-knight': {
    personality: 'Clunky robot-club pilot who yells "self-destruct sequence initiated!" too often.',
    quote: '"OVERLOAD PROTOCOL… sorry, got excited."',
  },
  'forest-archer': {
    personality: 'Calm ranger who never misses a diagonal shot.',
    quote: '"I see the opening. Arrow away."',
  },
  'phantom-thief': {
    personality: 'Dashing rogue who steals gold and hearts.',
    quote: '"I\'ll take that piece… and your wallet."',
  },
  'onsen-healer': {
    personality: 'Relaxed spa-club attendant who heals allies with hot-spring steam.',
    quote: '"Soak those wounds away. Ahh… much better."',
  },
  snowboarder: {
    personality: 'Chill thrill-seeker who shoves enemies downhill.',
    quote: '"Dude, wipe out."',
  },
  'magical-chef': {
    personality: 'Passionate cook who serves power meals with a wink.',
    quote: '"Eat up! It\'s buffed with love and secret spice."',
  },
  'spy-master': {
    personality: 'Cool operative who reveals enemy plans with a single glance.',
    quote: '"I already read your strategy. Boring."',
  },
  'bunny-girl': {
    personality: 'Bouncy brawler who hops from one fight to the next.',
    quote: '"Hop, hop, capture! Easy!"',
  },
  gardener: {
    personality: 'Patient cultivator who grows healing flowers on the front line.',
    quote: '"Bloom where you\'re planted… then heal everyone."',
  },
  'pirate-captain': {
    personality: 'Swaggering captain who sails straight toward the enemy king.',
    quote: '"Boarding party! Your king is mine!"',
  },
  scientist: {
    personality: 'Curious researcher who marks targets for bigger experiments.',
    quote: '"Subject marked. Increasing damage output by 300%."',
  },
  'fashion-model': {
    personality: 'Stunning diva whose dazzle stops enemies in their tracks.',
    quote: '"Don\'t look directly at me… oops, too late."',
  },
  'karate-girl': {
    personality: 'Disciplined fighter focused on powerful, focused strikes.',
    quote: '"Hiyah! One clean strike ends the match."',
  },
  mermaid: {
    personality: 'Serene songstress who flows across the board like water.',
    quote: '"Let the current carry you… into my trap."',
  },
  'ghost-girl': {
    personality: 'Timid spirit who phases through enemies with a shy "boo."',
    quote: '"U-um… boo? Please don\'t be scared…"',
  },
  alchemist: {
    personality: 'Eccentric inventor who turns allies into surprises.',
    quote: '"Let\'s see what this transmutation does!"',
  },
  racer: {
    personality: 'Adrenaline junkie who overdrives across straightaways.',
    quote: '"Pedal to the metal—checkered flag in sight!"',
  },
  'shrine-guardian': {
    personality: 'Silent protector who reflects harm back at attackers.',
    quote: '"Your attack returns to sender."',
  },
  'pop-star': {
    personality: 'Charismatic idol whose charm makes enemies skip their turn.',
    quote: '"Everybody freeze for my chorus!"',
  },
  'eternal-queen': {
    personality: 'Timeless student-council president who can rewind fate itself once per run.',
    quote: '"Let\'s redo that. I refuse to accept this outcome."',
  },
  'moonlight-reaper': {
    personality: 'Grim harvester who grows stronger as allies fall.',
    quote: '"The moon rises… and so does my power."',
  },
  'sunflower-paladin': {
    personality: 'Radiant knight whose sunny aura mends nearby friends.',
    quote: '"Turn your face to the sun and heal."',
  },
  'void-princess': {
    personality: 'Aloof royalty who banishes enemies into the void.',
    quote: '"You\'re not worth my time. Banish."',
  },
  'crystal-oracle': {
    personality: 'Seer who peers into future enemy maneuvers.',
    quote: '"I saw your next move before you did."',
  },
  'blazing-oni': {
    personality: 'Furious demon who charges through everything in a straight line.',
    quote: '"Out of my way! I\'m taking the whole file!"',
  },
  'starlight-idol': {
    personality: 'Cosmic performer whose encore buffs the whole team.',
    quote: '"Encore! The whole squad shines now!"',
  },
  'necromancer-chan': {
    personality: 'Cute necromancer who befriends fallen enemies.',
    quote: '"You\'re so much cuter on my side!"',
  },
  'guardian-angel': {
    personality: 'Devoted protector who takes a fatal blow for the king.',
    quote: '"Not on my watch. I\'ll shield you."',
  },
  'demon-queen': {
    personality: 'Volatile tyrant who trades safety for overwhelming power.',
    quote: '"A little blood for a lot of board? Worth it."',
  },
  'time-traveler': {
    personality: 'Whimsy wanderer who rewinds to a safer moment.',
    quote: '"Wait, I\'ve been here before. Let\'s fix it."',
  },
  'cosmic-dragon': {
    personality: 'Ancient star wyrm who breathes diagonal starfire.',
    quote: '"My starfire reduces pawns to stardust."',
  },
  'holy-knight': {
    personality: 'Virtuous champion who can resurrect one fallen ally.',
    quote: '"Rise, friend. The match isn\'t over."',
  },
  'eclipse-sorceress': {
    personality: 'Moody mage who shifts the very board between day and night.',
    quote: '"Day turns to night, and so do your plans."',
  },
  'final-boss-queen': {
    personality: 'The reigning champion captain: dramatic, powerful, and loves monologues.',
    quote: '"You dare challenge the throne? Cute."',
  },
  king: {
    personality: 'Nervous club president; the whole match ends if he falls.',
    quote: '"P-please protect me, everyone!"',
  },
  queen: {
    personality: 'Regal ace who commands the board with effortless grace.',
    quote: '"I don\'t need the spotlight. I am the spotlight."',
  },
  rook: {
    personality: 'Steadfast castle-club member who dominates straight lines.',
    quote: '"Straightforward and strong—that\'s my motto."',
  },
  bishop: {
    personality: 'Wise strategy-club veteran who strikes from afar on diagonals.',
    quote: '"Diagonals are just shortcuts to victory."',
  },
  knight: {
    personality: 'Gallant charger who leaps over obstacles and asks questions later.',
    quote: '"Over the pawns, through the lines—charge!"',
  },
  pawn: {
    personality: 'Humble first-year who dreams of promotion.',
    quote: '"One day I\'ll reach the far rank… you\'ll see!"',
  },
};

let source = readFileSync(piecesPath, 'utf-8');

for (const [id, data] of Object.entries(personalities)) {
  const iconRegex = new RegExp(`(id: ['"]${id}['"],[\\s\\S]*?)(\\s+icon: ['"].*?['"],?\\s*$)`, 'm');
  const replacement = `$1\n    personality: '${data.personality.replace(/'/g, "\\'")}',\n    flavorQuote: '${data.quote.replace(/'/g, "\\'")}',\n$2`;
  source = source.replace(iconRegex, replacement);
}

writeFileSync(piecesPath, source, 'utf-8');
console.log(`Injected personalities into ${Object.keys(personalities).length} pieces.`);
