import type { PieceDefinition, UnitPool } from './types';

export const PIECE_DEFINITIONS: PieceDefinition[] = [
  // Tier 1 – Common
  {
    id: 'magical-girl-rook',
    name: 'Magical Girl Rook',
    tier: 1,
    category: 'defensive',
    movement: 'rook',
    ability: {
      name: 'Barrier',
      description: 'Give an adjacent ally a protective barrier.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Stoic student-council vice president who defends the club room with dramatic barrier magic.',
    flavorQuote: '"No one bullies my teammates on my watch! Barrier, deploy!"',

  portraitImage: 'magical-girl-rook-portrait.jpg',
  miniImage: 'magical-girl-rook-mini.jpg',
  backstory: 'A transferred magical-girl fan who joined the chess club because the barrier magic classes conflicted with choir. She treats every pawn push like a transformation sequence.',
    icon: '🏰',
  },
  {
    id: 'ninja-knight',
    name: 'Ninja Knight',
    tier: 1,
    category: 'trickster',
    movement: 'knight',
    ability: {
      name: 'Shadow Step',
      description: 'Move like a knight again in the same turn.',
      trigger: 'active',
      uses: 2,
    },
    personality: 'Silent transfer student who appears in a puff of smoke and vanishes before roll call.',
    flavorQuote: '"You can\'t check what you can\'t see."',

  portraitImage: 'ninja-knight-portrait.jpg',
  miniImage: 'ninja-knight-mini.jpg',
  backstory: 'The club\'s silent enforcer. No one knows his real name, but he once shadow-stepped across three tables to catch a falling king.',
    icon: '🥷',
  },
  {
    id: 'idol-bishop',
    name: 'Idol Bishop',
    tier: 1,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Fan Service',
      description: 'Buff an adjacent ally with +1 range this turn.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Cheerful campus idol whose chants buff allies and draw crowds at culture festivals.',
    flavorQuote: '"Everyone, cheer with me—range up!"',

  portraitImage: 'idol-bishop-portrait.jpg',
  miniImage: 'idol-bishop-mini.jpg',
  backstory: 'An aspiring school idol who accidentally joined the chess club thinking it was the "cheer club." She stayed when she realized bishops move diagonally "like dance formations."',
    icon: '🎤',
  },
  {
    id: 'dragon-princess',
    name: 'Dragon Princess',
    tier: 1,
    category: 'offensive',
    movement: 'dragon',
    isRoyal: true,
    defaultRank: 0,
    ability: {
      name: 'Promote',
      description: 'Promote to Dragon Queen upon reaching the far rank.',
      trigger: 'passive',
    },
    personality: 'Proud royal who joined the club to prove she can rise from kōhai to queen.',
    flavorQuote: '"Just you wait—by the far rank, I\'ll be unstoppable!"',

  portraitImage: 'dragon-princess-portrait.jpg',
  miniImage: 'dragon-princess-mini.jpg',
  backstory: 'A first-year noble who insists she will "promote to greatness" by the end of the tournament. Her pride is matched only by her surprising kindness to pawns.',
    icon: '🐉',
  },
  {
    id: 'shrine-maiden',
    name: 'Shrine Maiden',
    tier: 1,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Purify',
      description: 'Remove debuffs from an adjacent ally.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Gentle purifier who cleanses curses, offers tea, and never misses morning practice.',
    flavorQuote: '"A calm board is a clean board. Purify!"',

  portraitImage: 'sakura-portrait.jpg',
  miniImage: 'sakura-mini.jpg',
  backstory: 'Sakura captains Seishin High\'s shrine chess team. She sees the board as a sacred space and treats every match as a purification ritual between schools.',
  relationships: {
    'king': 'Sakura finds Hana\'s earnest prayers familiar and a little dangerous—too much faith can make a player predictable.'
  },
    icon: '⛩️',
  },
  {
    id: 'schoolgirl-pawn',
    name: 'Schoolgirl Pawn',
    tier: 1,
    category: 'utility',
    movement: 'pawn',
    promotionTarget: 'queen',
    personality: 'Eager first-year who studies openings every night and dreams of promotion.',
    flavorQuote: '"One step at a time… I\'ll make senpai proud!"',

  portraitImage: 'schoolgirl-pawn-portrait.jpg',
  miniImage: 'schoolgirl-pawn-mini.jpg',
  backstory: 'The most junior member of Alishan\'s club. She studies openings every night and dreams of promotion—not just on the board, but into someone the team can rely on.',
    icon: '🎒',
  },

  // Seishin High enemy set
  {
    id: 'seishin-king',
    name: 'Seishin Priestess',
    tier: 1,
    category: 'defensive',
    movement: 'king',
    isRoyal: true,
    defaultRank: 0,
    ability: {
      name: 'Purify',
      description: 'Remove debuffs from an adjacent ally.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Calm shrine priestess who leads Seishin High with measured steps and quiet prayers.',
    flavorQuote: '"The board is a sacred space. I will not let it be defiled."',
    portraitImage: 'seishin-king-portrait.jpg',
    miniImage: 'seishin-king-mini.jpg',
    backstory: 'Sakura captains Seishin High\'s shrine chess team. She sees every match as a purification ritual between schools, and her king is never rushed.',
    uniformTheme: 'seishin',
    enemyOnly: true,
    icon: '⛩️',
  },
  {
    id: 'seishin-bishop',
    name: 'Seishin Miko',
    tier: 1,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Barrier Bell',
      description: 'Give an adjacent ally a protective barrier.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Devoted shrine maiden whose bell-clear chants shield allies from harm.',
    flavorQuote: '"Ring once for protection, ring twice for victory."',
    portraitImage: 'seishin-bishop-portrait.jpg',
    miniImage: 'seishin-bishop-mini.jpg',
    backstory: 'A second-year miko who joined the chess club after realizing diagonal movements mirror the paths of shrine rituals.',
    uniformTheme: 'seishin',
    enemyOnly: true,
    icon: '🔔',
  },
  {
    id: 'seishin-pawn',
    name: 'Seishin Acolyte',
    tier: 1,
    category: 'utility',
    movement: 'pawn',
    promotionTarget: 'queen',
    personality: 'Humble shrine trainee who walks forward one careful step at a time.',
    flavorQuote: '"One step closer to the sacred rank…"',
    portraitImage: 'seishin-pawn-portrait.jpg',
    miniImage: 'seishin-pawn-mini.jpg',
    backstory: 'The youngest member of Seishin\'s team. She sweeps the courtyard before dawn and studies pawn breaks by lantern light.',
    uniformTheme: 'seishin',
    enemyOnly: true,
    icon: '🎐',
  },

  {
    id: 'maid-knight',
    name: 'Maid Knight',
    tier: 1,
    category: 'utility',
    movement: 'knight',
    ability: {
      name: 'Clean Sweep',
      description: 'Remove hazards or debuffs from an adjacent square.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Polished and precise; tidies the board while sweeping enemies aside.',
    flavorQuote: '"Leave the cleaning—and the checkmate—to me."',

    icon: '🧹',
  },
  {
    id: 'tennis-bishop',
    name: 'Tennis Bishop',
    tier: 1,
    category: 'control',
    movement: 'bishop',
    ability: {
      name: 'Backhand',
      description: 'Push an adjacent enemy one square away.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Energetic sports-club ace who volleys pieces around with a wicked backhand.',
    flavorQuote: '"Backhand down the diagonal—ace!"',

    icon: '🎾',
  },
  {
    id: 'bookworm-rook',
    name: 'Bookworm Rook',
    tier: 1,
    category: 'offensive',
    movement: 'rook',
    ability: {
      name: 'Study',
      description: '+1 movement range after making a capture.',
      trigger: 'passive',
    },
    personality: 'Quiet strategist who takes notes and gets stronger with every capture.',
    flavorQuote: '"According to my notes, you\'re already losing."',

    icon: '📚',
  },
  {
    id: 'catgirl-pawn',
    name: 'Catgirl Pawn',
    tier: 1,
    category: 'utility',
    movement: 'pawn',
    promotionTarget: 'knight',
    personality: 'Playful and unpredictable; pounces forward then naps on the clock.',
    flavorQuote: '"Nyaa~ I\'m not lazy, I\'m charging my attack!"',

    icon: '🐱',
  },
  {
    id: 'cheerleader',
    name: 'Cheerleader',
    tier: 1,
    category: 'support',
    movement: 'king',
    ability: {
      name: 'Cheer',
      description: 'Give an adjacent ally +1 capture damage this turn.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Loud, peppy, and convinced shouting helps allies hit harder.',
    flavorQuote: '"Gimme a C! Gimme an H! Gimme your king!"',

    icon: '📣',
  },
  {
    id: 'piano-bishop',
    name: 'Piano Bishop',
    tier: 1,
    category: 'control',
    movement: 'bishop',
    ability: {
      name: 'Stun Line',
      description: 'Stun an enemy along a bishop line.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Dramatic composer whose melodies stun foes mid-step.',
    flavorQuote: '"Listen to this crescendo… and freeze."',

    icon: '🎹',
  },
  {
    id: 'library-assistant',
    name: 'Library Assistant',
    tier: 1,
    category: 'trickster',
    movement: 'bishop',
    ability: {
      name: 'Swap',
      description: 'Swap positions with an adjacent piece.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Shy but clever; swaps places when nobody is looking.',
    flavorQuote: '"Shh… I\'m just reshelving this piece."',

    icon: '🤓',
  },
  {
    id: 'track-star',
    name: 'Track Star',
    tier: 1,
    category: 'offensive',
    movement: 'short-rook',
    range: 3,
    ability: {
      name: 'Sprint',
      description: 'Move twice in one turn, once per battle.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Always sprinting; out of breath but out of reach.',
    flavorQuote: '"I\'ll lap you before you finish thinking."',

    icon: '🏃',
  },
  {
    id: 'baker',
    name: 'Baker',
    tier: 1,
    category: 'support',
    movement: 'king',
    ability: {
      name: 'Fresh Loaf',
      description: 'Heal an adjacent ally.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Warm-hearted healer armed with fresh bread and hugs.',
    flavorQuote: '"Have a loaf, heal up, and let\'s win this!"',

    icon: '🥐',
  },

  // Tier 2 – Specialized
  {
    id: 'sakura-assassin',
    name: 'Sakura Assassin',
    tier: 2,
    category: 'offensive',
    movement: 'knight',
    canJump: true,
    ability: {
      name: 'Chain Strike',
      description: 'Chain up to 3 knight jumps if each captures an enemy.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Elegant third-year who dances from target to target under falling petals.',
    flavorQuote: '"Blossom, fall, strike—three moves, one ko."',

  portraitImage: 'sakura-assassin-portrait.jpg',
  miniImage: 'sakura-assassin-mini.jpg',
  backstory: 'A third-year from an unaffiliated dojo who enters the tournament as a ringer. She says she fights alone, but keeps glancing at Alishan\'s bench.',
    icon: '🌸',
  },
  {
    id: 'celestial-mage',
    name: 'Celestial Mage',
    tier: 2,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Teleport',
      description: 'Teleport to any empty square in range 3.',
      trigger: 'active',
      range: 3,
      uses: 2,
    },
    personality: 'Mysterious stargazer who bends space for a better angle.',
    flavorQuote: '"The stars aligned… right behind your king."',

  portraitImage: 'luna-portrait.jpg',
  miniImage: 'luna-mini.jpg',
  backstory: 'Luna is the top strategist of Celestial Mage Collegium. She reads star charts before every match and genuinely believes the universe has already decided the winner.',
  relationships: {
    'queen': 'Luna still considers Mira her greatest "what if"—a rival who chose faith over astrology.'
  },
    icon: '🔮',
  },
  {
    id: 'valkyrie-paladin',
    name: 'Valkyrie Paladin',
    tier: 2,
    category: 'defensive',
    movement: 'rook',
    ability: {
      name: 'Shield Aura',
      description: 'Adjacent allies gain a barrier.',
      trigger: 'passive',
      range: 1,
    },
    personality: 'Noble guardian who shields allies with radiant wings.',
    flavorQuote: '"Stand behind me. No one falls today."',

  portraitImage: 'valkyrie-paladin-portrait.jpg',
  miniImage: 'valkyrie-paladin-mini.jpg',
  backstory: 'A defender from Celestial Mage Collegium who transferred mid-season to "protect someone worth protecting." She refuses to say who.',
    icon: '🛡️',
  },
  {
    id: 'kitsune-trickster',
    name: 'Kitsune Trickster',
    tier: 2,
    category: 'trickster',
    movement: 'jump-king',
    range: 2,
    ability: {
      name: 'Illusion Swap',
      description: 'Swap positions with any piece in range 2.',
      trigger: 'active',
      range: 2,
      uses: 2,
    },
    personality: 'Mischievous fox spirit who swaps places just for fun.',
    flavorQuote: '"Now I\'m here, now I\'m there—bet you can\'t keep up!"',

  portraitImage: 'yuki-portrait.jpg',
  miniImage: 'yuki-mini.jpg',
  backstory: 'Yuki is Kitsune Illusion Academy\'s star trickster. She flirts with opponents to unsettle them, but her grin slips whenever someone sees through an illusion cleanly.',
  relationships: {
    'king': 'Yuki calls Hana "prayer-chan" and claims it\'s just teasing. It might be more.'
  },
    icon: '🦊',
  },
  {
    id: 'thunder-samurai',
    name: 'Thunder Samurai',
    tier: 2,
    category: 'offensive',
    movement: 'rook',
    ability: {
      name: 'Thunder Dash',
      description: 'Dash through a rook line, capturing all enemies in the path.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Honor-bound warrior who dashes through lines in a flash.',
    flavorQuote: '"My rook line is the path of thunder."',

  portraitImage: 'ren-portrait.jpg',
  miniImage: 'ren-mini.jpg',
  backstory: 'Ren is Thunder Samurai Institute\'s ace and loudest voice. He values honor above all else, which makes his growing crush on a prayer-school captain extremely inconvenient.',
  relationships: {
    'king': 'Ren respects Hana\'s calm under pressure and keeps inventing excuses to face her in practice matches.'
  },
    icon: '⚔️',
  },
  {
    id: 'candy-witch',
    name: 'Candy Witch',
    tier: 2,
    category: 'control',
    movement: 'bishop',
    ability: {
      name: 'Candy Trap',
      description: 'Slow an enemy on hit, reducing its movement next turn.',
      trigger: 'on-capture',
    },
    personality: 'Sweet-toothed sorceress who leaves sticky traps everywhere.',
    flavorQuote: '"Try to move through this. It\'s sugar-free… but deadly."',

  portraitImage: 'candy-portrait.jpg',
  miniImage: 'candy-mini.jpg',
  backstory: 'Candy is the captain of Candy Forest Prep\'s "Confectionery Combat Club." She decorates the board like a dessert and traps like a spider with a sweet tooth.',
    icon: '🍬',
  },
  {
    id: 'mecha-knight',
    name: 'Mecha Knight',
    tier: 2,
    category: 'offensive',
    movement: 'knight',
    ability: {
      name: 'Self-Destruct',
      description: 'Explode, dealing damage to adjacent enemies.',
      trigger: 'active',
      range: 1,
      uses: 1,
    },
    personality: 'Clunky robot-club pilot who yells "self-destruct sequence initiated!" too often.',
    flavorQuote: '"OVERLOAD PROTOCOL… sorry, got excited."',

    icon: '🤖',
  },
  {
    id: 'forest-archer',
    name: 'Forest Archer',
    tier: 2,
    category: 'offensive',
    movement: 'bishop-range',
    range: 4,
    ability: {
      name: 'Volley',
      description: 'Shoot over pieces in a bishop direction.',
      trigger: 'active',
      uses: 2,
    },
    personality: 'Calm ranger who never misses a diagonal shot.',
    flavorQuote: '"I see the opening. Arrow away."',

  portraitImage: 'forest-archer-portrait.jpg',
  miniImage: 'forest-archer-mini.jpg',
  backstory: 'A calm ranger from the countryside who joined the tournament to prove that patience beats flash. She never raises her voice, even when winning.',
    icon: '🏹',
  },
  {
    id: 'phantom-thief',
    name: 'Phantom Thief',
    tier: 2,
    category: 'trickster',
    movement: 'knight',
    ability: {
      name: 'Steal',
      description: 'Gain extra gold when capturing.',
      trigger: 'on-capture',
    },
    personality: 'Dashing rogue who steals gold and hearts.',
    flavorQuote: '"I\'ll take that piece… and your wallet."',

    icon: '🎭',
  },
  {
    id: 'onsen-healer',
    name: 'Onsen Healer',
    tier: 2,
    category: 'support',
    movement: 'king',
    ability: {
      name: 'Soothing Waters',
      description: 'Heal adjacent allies at the start of your turn.',
      trigger: 'passive',
      range: 1,
    },
    personality: 'Relaxed spa-club attendant who heals allies with hot-spring steam.',
    flavorQuote: '"Soak those wounds away. Ahh… much better."',

    icon: '♨️',
  },
  {
    id: 'snowboarder',
    name: 'Snowboarder',
    tier: 2,
    category: 'control',
    movement: 'rook',
    ability: {
      name: 'Shove',
      description: 'Slide into an enemy and knock it back one square.',
      trigger: 'active',
      uses: 2,
    },
    personality: 'Chill thrill-seeker who shoves enemies downhill.',
    flavorQuote: '"Dude, wipe out."',

    icon: '🏂',
  },
  {
    id: 'magical-chef',
    name: 'Magical Chef',
    tier: 2,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Power Meal',
      description: 'Grant an adjacent ally a temporary stat boost.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Passionate cook who serves power meals with a wink.',
    flavorQuote: '"Eat up! It\'s buffed with love and secret spice."',

    icon: '👩‍🍳',
  },
  {
    id: 'spy-master',
    name: 'Spy Master',
    tier: 2,
    category: 'utility',
    movement: 'king-plus-one',
    ability: {
      name: 'Reveal',
      description: 'Reveal all enemy abilities.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Cool operative who reveals enemy plans with a single glance.',
    flavorQuote: '"I already read your strategy. Boring."',

    icon: '🕵️',
  },
  {
    id: 'bunny-girl',
    name: 'Bunny Girl',
    tier: 2,
    category: 'offensive',
    movement: 'knight',
    ability: {
      name: 'Extra Hop',
      description: 'Gain an extra knight move after a capture.',
      trigger: 'on-capture',
    },
    personality: 'Bouncy brawler who hops from one fight to the next.',
    flavorQuote: '"Hop, hop, capture! Easy!"',

    icon: '🐰',
  },
  {
    id: 'gardener',
    name: 'Gardener',
    tier: 2,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Healing Flower',
      description: 'Place a healing flower on an adjacent square.',
      trigger: 'active',
      range: 1,
      uses: 2,
    },
    personality: 'Patient cultivator who grows healing flowers on the front line.',
    flavorQuote: '"Bloom where you\'re planted… then heal everyone."',

    icon: '🌻',
  },
  {
    id: 'pirate-captain',
    name: 'Pirate Captain',
    tier: 2,
    category: 'offensive',
    movement: 'rook',
    ability: {
      name: 'Boarding Party',
      description: 'Move adjacent to the enemy King once per battle.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Swaggering captain who sails straight toward the enemy king.',
    flavorQuote: '"Boarding party! Your king is mine!"',

    icon: '☠️',
  },
  {
    id: 'scientist',
    name: 'Scientist',
    tier: 2,
    category: 'control',
    movement: 'bishop',
    ability: {
      name: 'Mark Target',
      description: 'Mark an enemy to take extra damage next hit.',
      trigger: 'active',
      range: 3,
      uses: 2,
    },
    personality: 'Curious researcher who marks targets for bigger experiments.',
    flavorQuote: '"Subject marked. Increasing damage output by 300%."',

    icon: '🔬',
  },
  {
    id: 'fashion-model',
    name: 'Fashion Model',
    tier: 2,
    category: 'control',
    movement: 'king',
    ability: {
      name: 'Dazzle',
      description: 'Nearby enemies skip their next turn.',
      trigger: 'active',
      range: 2,
      uses: 1,
    },
    personality: 'Stunning diva whose dazzle stops enemies in their tracks.',
    flavorQuote: '"Don\'t look directly at me… oops, too late."',

    icon: '💃',
  },
  {
    id: 'karate-girl',
    name: 'Karate Girl',
    tier: 2,
    category: 'offensive',
    movement: 'short-rook',
    range: 2,
    ability: {
      name: 'Focused Strike',
      description: 'Powerful forward strike that also pushes.',
      trigger: 'active',
      uses: 2,
    },
    personality: 'Disciplined fighter focused on powerful, focused strikes.',
    flavorQuote: '"Hiyah! One clean strike ends the match."',

    icon: '🥋',
  },
  {
    id: 'mermaid',
    name: 'Mermaid',
    tier: 2,
    category: 'utility',
    movement: 'bishop',
    ability: {
      name: 'Flow',
      description: 'Move through water tiles freely.',
      trigger: 'passive',
    },
    personality: 'Serene songstress who flows across the board like water.',
    flavorQuote: '"Let the current carry you… into my trap."',

    icon: '🧜',
  },
  {
    id: 'ghost-girl',
    name: 'Ghost Girl',
    tier: 2,
    category: 'trickster',
    movement: 'king',
    ability: {
      name: 'Phase',
      description: 'Phase through one enemy per turn.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Timid spirit who phases through enemies with a shy "boo."',
    flavorQuote: '"U-um… boo? Please don\'t be scared…"',

    icon: '👻',
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    tier: 2,
    category: 'utility',
    movement: 'bishop',
    ability: {
      name: 'Transmute',
      description: 'Temporarily transform an adjacent ally into another piece.',
      trigger: 'active',
      range: 1,
      uses: 1,
    },
    personality: 'Eccentric inventor who turns allies into surprises.',
    flavorQuote: '"Let\'s see what this transmutation does!"',

    icon: '⚗️',
  },
  {
    id: 'racer',
    name: 'Racer',
    tier: 2,
    category: 'offensive',
    movement: 'rook',
    ability: {
      name: 'Overdrive',
      description: 'Move extra far in straight lines this turn.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Adrenaline junkie who overdrives across straightaways.',
    flavorQuote: '"Pedal to the metal—checkered flag in sight!"',

    icon: '🏎️',
  },
  {
    id: 'shrine-guardian',
    name: 'Shrine Guardian',
    tier: 2,
    category: 'defensive',
    movement: 'rook',
    ability: {
      name: 'Reflect',
      description: 'Reflect one attack per battle.',
      trigger: 'passive',
      uses: 1,
    },
    personality: 'Silent protector who reflects harm back at attackers.',
    flavorQuote: '"Your attack returns to sender."',

    icon: '⛩️',
  },
  {
    id: 'pop-star',
    name: 'Pop Star',
    tier: 2,
    category: 'control',
    movement: 'bishop',
    ability: {
      name: 'Charm',
      description: 'Area charm causing enemies in range 2 to skip a turn.',
      trigger: 'active',
      range: 2,
      uses: 1,
    },
    personality: 'Charismatic idol whose charm makes enemies skip their turn.',
    flavorQuote: '"Everybody freeze for my chorus!"',

  portraitImage: 'pop-star-portrait.jpg',
  miniImage: 'pop-star-mini.jpg',
  backstory: 'A chart-topping school idol who treats every match as a live performance. Her charm skill can literally make opposing pieces skip a turn.',
    icon: '🎤',
  },

  // Tier 3 – Rare & Legendary
  {
    id: 'eternal-queen',
    name: 'Eternal Queen',
    tier: 3,
    category: 'support',
    movement: 'queen',
    ability: {
      name: 'Time Rewind',
      description: 'Rewind to the start of the current battle once per run.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Timeless student-council president who can rewind fate itself once per run.',
    flavorQuote: '"Let\'s redo that. I refuse to accept this outcome."',

  portraitImage: 'eternal-queen-portrait.jpg',
  miniImage: 'eternal-queen-mini.jpg',
  backstory: 'The student council president of an elite academy, rumored to have once rewound an entire match to save a friend. No one can prove it.',
    icon: '👑',
  },
  {
    id: 'moonlight-reaper',
    name: 'Moonlight Reaper',
    tier: 3,
    category: 'offensive',
    movement: 'extended-knight',
    ability: {
      name: 'Reap',
      description: 'Long-range capture; grows stronger when allies fall.',
      trigger: 'passive',
    },
    personality: 'Grim harvester who grows stronger as allies fall.',
    flavorQuote: '"The moon rises… and so does my power."',

  portraitImage: 'moonlight-reaper-portrait.jpg',
  miniImage: 'moonlight-reaper-mini.jpg',
  backstory: 'A lone striker who grows stronger as allies fall. Some say she\'s cursed; she says she\'s just used to being the last one standing.',
    icon: '💀',
  },
  {
    id: 'sunflower-paladin',
    name: 'Sunflower Paladin',
    tier: 3,
    category: 'defensive',
    movement: 'rook',
    ability: {
      name: 'Sun Aura',
      description: 'Constant healing aura for adjacent allies.',
      trigger: 'passive',
      range: 1,
    },
    personality: 'Radiant knight whose sunny aura mends nearby friends.',
    flavorQuote: '"Turn your face to the sun and heal."',

    icon: '🌻',
  },
  {
    id: 'void-princess',
    name: 'Void Princess',
    tier: 3,
    category: 'control',
    movement: 'short-queen',
    range: 4,
    ability: {
      name: 'Banish',
      description: 'Remove an enemy from the board once per battle.',
      trigger: 'active',
      range: 3,
      uses: 1,
    },
    personality: 'Aloof royalty who banishes enemies into the void.',
    flavorQuote: '"You\'re not worth my time. Banish."',

  portraitImage: 'void-princess-portrait.jpg',
  miniImage: 'void-princess-mini.jpg',
  backstory: 'Aloof royalty from Final Boss Throne Academy who can banish pieces from the board. She finds most opponents "not worth the void."',
    icon: '🌑',
  },
  {
    id: 'crystal-oracle',
    name: 'Crystal Oracle',
    tier: 3,
    category: 'utility',
    movement: 'bishop',
    ability: {
      name: 'Foresee',
      description: 'Reveal the next enemy moves.',
      trigger: 'active',
      uses: 2,
    },
    personality: 'Seer who peers into future enemy maneuvers.',
    flavorQuote: '"I saw your next move before you did."',

    icon: '🔮',
  },
  {
    id: 'blazing-oni',
    name: 'Blazing Oni',
    tier: 3,
    category: 'offensive',
    movement: 'rook',
    ability: {
      name: 'Line Charge',
      description: 'Charge in a straight line, capturing everything in the path.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Furious demon who charges through everything in a straight line.',
    flavorQuote: '"Out of my way! I\'m taking the whole file!"',

    icon: '👹',
  },
  {
    id: 'starlight-idol',
    name: 'Starlight Idol',
    tier: 3,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Encore',
      description: 'Team-wide buff on capture.',
      trigger: 'on-capture',
    },
    personality: 'Cosmic performer whose encore buffs the whole team.',
    flavorQuote: '"Encore! The whole squad shines now!"',

    icon: '🌟',
  },
  {
    id: 'necromancer-chan',
    name: 'Necromancer-chan',
    tier: 3,
    category: 'support',
    movement: 'bishop',
    ability: {
      name: 'Raise',
      description: 'Raise fallen enemies as allies.',
      trigger: 'active',
      range: 2,
      uses: 1,
    },
    personality: 'Cute necromancer who befriends fallen enemies.',
    flavorQuote: '"You\'re so much cuter on my side!"',

    icon: '🧟',
  },
  {
    id: 'guardian-angel',
    name: 'Guardian Angel',
    tier: 3,
    category: 'defensive',
    movement: 'king',
    ability: {
      name: 'Interception',
      description: 'Intercept a lethal attack on your King once per run.',
      trigger: 'passive',
      uses: 1,
    },
    personality: 'Devoted protector who takes a fatal blow for the king.',
    flavorQuote: '"Not on my watch. I\'ll shield you."',

    icon: '😇',
  },
  {
    id: 'demon-queen',
    name: 'Demon Queen',
    tier: 3,
    category: 'offensive',
    movement: 'queen',
    ability: {
      name: 'Blood Rush',
      description: 'Sacrifice HP for massive movement.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Volatile tyrant who trades safety for overwhelming power.',
    flavorQuote: '"A little blood for a lot of board? Worth it."',

  portraitImage: 'victoria-portrait.jpg',
  miniImage: 'victoria-mini.jpg',
  backstory: 'Victoria is the reigning national champion and final boss of the tournament. Three years ago she was a prayer-school hopeful like Hana, before disappointment burned every softness away.',
  relationships: {
    'king': 'Victoria sees too much of her younger self in Hana and hates her for it.'
  },
    icon: '👿',
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    tier: 3,
    category: 'trickster',
    movement: 'king',
    ability: {
      name: 'Rewind Position',
      description: 'Return to a previous position once per run.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Whimsy wanderer who rewinds to a safer moment.',
    flavorQuote: '"Wait, I\'ve been here before. Let\'s fix it."',

    icon: '⏳',
  },
  {
    id: 'cosmic-dragon',
    name: 'Cosmic Dragon',
    tier: 3,
    category: 'offensive',
    movement: 'dragon',
    ability: {
      name: 'Star Fire',
      description: 'Cone attack in a diagonal direction.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Ancient star wyrm who breathes diagonal starfire.',
    flavorQuote: '"My starfire reduces pawns to stardust."',

    icon: '🌌',
  },
  {
    id: 'holy-knight',
    name: 'Holy Knight',
    tier: 3,
    category: 'support',
    movement: 'rook',
    ability: {
      name: 'Revive',
      description: 'Revive one fallen ally once per run.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Virtuous champion who can resurrect one fallen ally.',
    flavorQuote: '"Rise, friend. The match isn\'t over."',

    icon: '🛡️',
  },
  {
    id: 'eclipse-sorceress',
    name: 'Eclipse Sorceress',
    tier: 3,
    category: 'control',
    movement: 'bishop',
    ability: {
      name: 'Eclipse',
      description: 'Switch day/night, affecting all piece movement.',
      trigger: 'active',
      uses: 1,
    },
    personality: 'Moody mage who shifts the very board between day and night.',
    flavorQuote: '"Day turns to night, and so do your plans."',

    icon: '🌒',
  },
  {
    id: 'final-boss-queen',
    name: 'Final Boss Queen',
    tier: 3,
    category: 'offensive',
    movement: 'queen',
    isRoyal: true,
    ability: {
      name: 'Boss Rush',
      description: 'Multiple powerful abilities for boss battles only.',
      trigger: 'active',
      uses: 3,
    },
    personality: 'The reigning champion captain: dramatic, powerful, and loves monologues.',
    flavorQuote: '"You dare challenge the throne? Cute."',

  portraitImage: 'kira-portrait.jpg',
  miniImage: 'kira-mini.jpg',
  backstory: 'Kira captains Yami no Gakuen and serves as the tournament\'s opening gatekeeper. She was Hana\'s closest friend until a single tournament slot drove them apart.',
  relationships: {
    'king': 'Kira wants Hana to suffer almost as much as she wants Hana to prove her wrong.'
  },
    icon: '👾',
  },

  // Standard pieces used internally for promotions and enemy basics
  {
    id: 'king',
    name: 'King',
    tier: 1,
    category: 'defensive',
    movement: 'king',
    isRoyal: true,
    defaultRank: 0,
    personality: 'Nervous club president; the whole match ends if he falls.',
    flavorQuote: '"P-please protect me, everyone!"',

  portraitImage: 'hana-portrait.jpg',
  miniImage: 'hana-mini.jpg',
  backstory: 'Hana is the soft-spoken captain of Alishan Academy\'s chess club. She was never the strongest player, but her ability to keep the team calm under pressure turned a group of misfits into regional contenders.',
  relationships: {
    'queen': 'Mira is Hana\'s vice-captain and the only person allowed to tease her about her terrible opening theory.',
    'final-boss-queen': 'Kira was Hana\'s childhood best friend before a falling-out over a tournament slot. Their reunion is equal parts bitter and heartbreaking.',
    'thunder-samurai': 'Ren keeps challenging Hana to unofficial blitz matches. She suspects he\'s flirting; he insists it\'s "respect."'
  },
    icon: '🤴',
  },
  {
    id: 'queen',
    name: 'Queen',
    tier: 2,
    category: 'offensive',
    movement: 'queen',
    personality: 'Regal ace who commands the board with effortless grace.',
    flavorQuote: '"I don\'t need the spotlight. I am the spotlight."',

  portraitImage: 'mira-portrait.jpg',
  miniImage: 'mira-mini.jpg',
  backstory: 'Mira is Alishan\'s tactical prodigy—a scholarship student from a rival district who transferred in after losing to Hana in a middle-school qualifier. She claims she stayed for the free chapel lunches.',
  relationships: {
    'king': 'Mira respects Hana\'s leadership more than she admits, and quietly rewrites every opening to suit her captain\'s style.',
    'celestial-mage': 'Luna once offered Mira a spot at Celestial Mage Collegium. Mira declined, but the offer still haunts her on bad nights.'
  },
    icon: '👸',
  },
  {
    id: 'rook',
    name: 'Rook',
    tier: 1,
    category: 'offensive',
    movement: 'rook',
    personality: 'Steadfast castle-club member who dominates straight lines.',
    flavorQuote: '"Straightforward and strong—that\'s my motto."',

  portraitImage: 'rook-club-portrait.jpg',
  miniImage: 'rook-mini.jpg',
  backstory: 'A dependable club member who dominates straight lines and straight talk.',
    icon: '🏰',
  },
  {
    id: 'bishop',
    name: 'Bishop',
    tier: 1,
    category: 'support',
    movement: 'bishop',
    personality: 'Wise strategy-club veteran who strikes from afar on diagonals.',
    flavorQuote: '"Diagonals are just shortcuts to victory."',

  portraitImage: 'bishop-club-portrait.jpg',
  miniImage: 'bishop-mini.jpg',
  backstory: 'A quiet strategist who prefers diagonal thinking and early-morning practice.',
    icon: '🧙',
  },
  {
    id: 'knight',
    name: 'Knight',
    tier: 1,
    category: 'trickster',
    movement: 'knight',
    personality: 'Gallant charger who leaps over obstacles and asks questions later.',
    flavorQuote: '"Over the pawns, through the lines—charge!"',

  portraitImage: 'knight-club-portrait.jpg',
  miniImage: 'knight-mini.jpg',
  backstory: 'The team\'s energetic charger who leaps over problems and asks questions later.',
    icon: '🦄',
  },
  {
    id: 'pawn',
    name: 'Pawn',
    tier: 1,
    category: 'utility',
    movement: 'pawn',
    promotionTarget: 'queen',
    personality: 'Humble first-year who dreams of promotion.',
    flavorQuote: '"One day I\'ll reach the far rank… you\'ll see!"',

  portraitImage: 'pawn-club-portrait.jpg',
  miniImage: 'pawn-mini.jpg',
  backstory: 'A humble first-year who dreams of promotion and never misses cleanup duty.',
    icon: '🧒',
  },
];

export const PIECE_BY_ID: Record<string, PieceDefinition> = Object.fromEntries(
  PIECE_DEFINITIONS.map((p) => [p.id, p]),
);

export function buildUnitPool(): UnitPool {
  const pool: UnitPool = { 1: [], 2: [], 3: [] };
  for (const piece of PIECE_DEFINITIONS) {
    if (['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'].includes(piece.id)) {
      continue;
    }
    if (piece.enemyOnly) {
      continue;
    }
    pool[piece.tier].push(piece);
  }
  return pool;
}

export const UNIT_POOL = buildUnitPool();

export function getUnlockedTiers(stageIndex: number): number[] {
  const tiers = [1];
  if (stageIndex >= 3) tiers.push(2);
  if (stageIndex >= 6) tiers.push(3);
  return tiers;
}

export function getDraftPool(stageIndex: number, playerArmy: string[]): PieceDefinition[] {
  const tiers = getUnlockedTiers(stageIndex);
  const armySet = new Set(playerArmy);
  const candidates: PieceDefinition[] = [];
  for (const tier of tiers) {
    for (const piece of UNIT_POOL[tier]) {
      if (!armySet.has(piece.id)) {
        candidates.push(piece);
      }
    }
  }
  return candidates;
}

export function rollDraftOptions(stageIndex: number, playerArmy: string[], count = 3): PieceDefinition[] {
  const pool = getDraftPool(stageIndex, playerArmy);
  if (pool.length === 0) return [];
  const shuffled = pool.toSorted(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
