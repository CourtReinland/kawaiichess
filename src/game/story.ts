import type { StoryScene } from './types';

export const STORY_SCENES: Record<string, StoryScene> = {
  'start-prologue': {
    id: 'start-prologue',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Every year, the National Chess Circuit chooses one school from each prefecture to enter the Elite Cohort.',
        position: 'center',
      },
      {
        speaker: 'Narrator',
        text: 'This year, against every prediction, that school is Alishan Academy—a tiny prayer-school whose chess club meets in the old chapel.',
        position: 'center',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Nobody expects us to win a single match. But we didn\'t come this far to lose with grace.',
        position: 'left',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'The bracket is brutal. Seven rival academies, each with their own magic, money, and grudges.',
        position: 'right',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Did someone say prayer-school? Hana, you actually showed up. I was hoping you\'d chicken out and save us all the embarrassment.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Kira... we used to share lunch under the cherry trees. Now you sound like every other bully in this bracket.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Bully? I\'m just being honest. You\'ll fight six other schools before you ever face me. If you even make it that far, I\'ll be waiting at the end.',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'Let her wait. We\'ve got a bracket to burn through.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Then let\'s give them a match they\'ll pray to forget. Alishan Academy—move out!',
        position: 'left',
      },
    ],
  },

  'intro-yami-no-gakuen': {
    id: 'intro-yami-no-gakuen',
    backgroundImage: 'story/intro/yami-no-gakuen.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Final match. The gothic halls of Yami no Gakuen. Candles, stained glass, and the smell of old grudges.',
        position: 'center',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Well, well. Little Hana from the chapel steps. I heard your name on the bracket and almost laughed.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Kira... we used to share lunch under the cherry trees. Now you hide behind skulls and candlelight?',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'People change. I learned that the night you chose your prayers over me. Let\'s see if your god can save your king.',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'Hana, focus. Whatever history she\'s dragging up, win first and cry later.',
        position: 'right',
      },
    ],
  },

  'outro-yami-no-gakuen-victory': {
    id: 'outro-yami-no-gakuen-victory',
    backgroundImage: 'story/outro/yami-no-gakuen.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Impossible. Your pieces moved like... like you could read every shadow I cast.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'I didn\'t need to read shadows. I just remembered how you used to smile when you won fair.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Shut up. Next time I won\'t hold back... and neither will my memories.',
        position: 'right',
      },
    ],
  },

  'outro-yami-no-gakuen-defeat': {
    id: 'outro-yami-no-gakuen-defeat',
    backgroundImage: 'story/outro/yami-no-gakuen.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Pathetic. Just like I predicted. Go light your candles, chapel girl.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'This isn\'t over, Kira. I don\'t care how dark your school is—I\'ll find the light switch.',
        position: 'left',
      },
    ],
  },

  'intro-seishin-high': {
    id: 'intro-seishin-high',
    backgroundImage: 'story/intro/seishin-high.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
      text: 'Match 2. Seishin High, where the koto hums and every opening is a purification ritual.',
        position: 'center',
      },
      {
        speaker: 'Sakura',
        speakerPieceId: 'shrine-maiden',
        text: 'Alishan Academy. Your reputation as underdogs precedes you, but your aura is... unexpectedly bright.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'We\'re not here to cause trouble, Sakura-san. Just to play the best chess we can.',
        position: 'left',
      },
      {
        speaker: 'Sakura',
        speakerPieceId: 'shrine-maiden',
        text: 'Noble words. But the board does not lie. Let us see if your prayers can withstand a clean strike.',
        position: 'right',
      },
    ],
  },

  'outro-seishin-high-victory': {
    id: 'outro-seishin-high-victory',
    backgroundImage: 'story/outro/seishin-high.jpg',
    dialogue: [
      {
        speaker: 'Sakura',
        speakerPieceId: 'shrine-maiden',
        text: 'You have a strange kind of purity, Hana. Even in victory, you do not gloat.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'I respect anyone who treats the board like sacred ground. We just happened to pray louder.',
        position: 'left',
      },
    ],
  },

  'outro-seishin-high-defeat': {
    id: 'outro-seishin-high-defeat',
    backgroundImage: 'story/outro/seishin-high.jpg',
    dialogue: [
      {
        speaker: 'Sakura',
        speakerPieceId: 'shrine-maiden',
        text: 'Your aura is clouded by doubt. Purify your heart, and perhaps the pieces will listen.',
        position: 'right',
      },
    ],
  },

  'intro-candy-forest-prep': {
    id: 'intro-candy-forest-prep',
    backgroundImage: 'story/intro/candy-forest-prep.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Match 3. Candy Forest Preparatory. The halls smell like sugar, and the traps taste like betrayal.',
        position: 'center',
      },
      {
        speaker: 'Candy',
        speakerPieceId: 'candy-witch',
        text: 'Hiiii~! Welcome to my sweet little forest. I baked cookies for the loser\'s bracket!',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'Her smile is a warning label. Don\'t eat anything, don\'t trust anything, don\'t let her giggle distract you.',
        position: 'right',
      },
      {
        speaker: 'Candy',
        speakerPieceId: 'candy-witch',
        text: 'Aww, you\'re no fun. But I promise—the checkmate will be delicious.',
        position: 'right',
      },
    ],
  },

  'outro-candy-forest-prep-victory': {
    id: 'outro-candy-forest-prep-victory',
    backgroundImage: 'story/outro/candy-forest-prep.jpg',
    dialogue: [
      {
        speaker: 'Candy',
        speakerPieceId: 'candy-witch',
        text: 'You saw through every trap? Even the caramel fork? Rude. Impressive, but rude.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Sorry, Candy. I\'m diabetic when it comes to losing.',
        position: 'left',
      },
    ],
  },

  'outro-candy-forest-prep-defeat': {
    id: 'outro-candy-forest-prep-defeat',
    backgroundImage: 'story/outro/candy-forest-prep.jpg',
    dialogue: [
      {
        speaker: 'Candy',
        speakerPieceId: 'candy-witch',
        text: 'Aww, you fell for the licorice gambit. Don\'t worry, losing tastes bitter but it builds character!',
        position: 'right',
      },
    ],
  },

  'intro-thunder-samurai-institute': {
    id: 'intro-thunder-samurai-institute',
    backgroundImage: 'story/intro/thunder-samurai-institute.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Match 4. Thunder Samurai Institute. The dojo floor vibrates with every shouted kata.',
        position: 'center',
      },
      {
        speaker: 'Ren',
        speakerPieceId: 'thunder-samurai',
        text: 'So you\'re the prayer-school captain everyone\'s whispering about. You look smaller than the rumors.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'And you\'re louder than the rumors, Ren-kun. Is that a strategy or a volume problem?',
        position: 'left',
      },
      {
        speaker: 'Ren',
        speakerPieceId: 'thunder-samurai',
        text: 'Heh. Cute. I\'ll make you a deal, chapel girl—if you survive thirty moves, I\'ll buy you ramen after.',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'Hana, he\'s flirting and threatening at the same time. That\'s either charming or deeply unprofessional.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Let\'s just say I\'m ordering the extra-large bowl. Of victory.',
        position: 'left',
      },
    ],
  },

  'outro-thunder-samurai-institute-victory': {
    id: 'outro-thunder-samurai-institute-victory',
    backgroundImage: 'story/outro/thunder-samurai-institute.jpg',
    dialogue: [
      {
        speaker: 'Ren',
        speakerPieceId: 'thunder-samurai',
        text: 'Thirty moves? You crushed me in twenty-four. I... I think I\'m in love.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Ramen\'s still on you, samurai. And maybe you can teach me that lightning dash sometime.',
        position: 'left',
      },
      {
        speaker: 'Ren',
        speakerPieceId: 'thunder-samurai',
        text: 'Only if you teach me how to pray without blushing. Deal?',
        position: 'right',
      },
    ],
  },

  'outro-thunder-samurai-institute-defeat': {
    id: 'outro-thunder-samurai-institute-defeat',
    backgroundImage: 'story/outro/thunder-samurai-institute.jpg',
    dialogue: [
      {
        speaker: 'Ren',
        speakerPieceId: 'thunder-samurai',
        text: 'No ramen for you. But hey—your prayers were almost fast enough. Almost.',
        position: 'right',
      },
    ],
  },

  'intro-kitsune-illusion-academy': {
    id: 'intro-kitsune-illusion-academy',
    backgroundImage: 'story/intro/kitsune-illusion-academy.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Match 5. Kitsune Illusion Academy. The corridors shift when you blink, and every student has a tail they deny.',
        position: 'center',
      },
      {
        speaker: 'Yuki',
        speakerPieceId: 'kitsune-trickster',
        text: 'Hana-chan~! I\'ve been waiting for you. Or was that your reflection? Even I get confused.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'I don\'t have time for riddles, Yuki. We\'re here to play chess, not hide-and-seek.',
        position: 'left',
      },
      {
        speaker: 'Yuki',
        speakerPieceId: 'kitsune-trickster',
        text: 'So serious~ But I bet you\'d smile if I stole just one little kiss instead of a piece.',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'She\'s trying to throw you off. Hana, eyes on the board, not the tails.',
        position: 'right',
      },
    ],
  },

  'outro-kitsune-illusion-academy-victory': {
    id: 'outro-kitsune-illusion-academy-victory',
    backgroundImage: 'story/outro/kitsune-illusion-academy.jpg',
    dialogue: [
      {
        speaker: 'Yuki',
        speakerPieceId: 'kitsune-trickster',
        text: 'You saw through every illusion? Even the one where I pretended to flirt? ...Okay, that one was real.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Save it for the next tournament. And Yuki? Keep your tails out of my king\'s row.',
        position: 'left',
      },
    ],
  },

  'outro-kitsune-illusion-academy-defeat': {
    id: 'outro-kitsune-illusion-academy-defeat',
    backgroundImage: 'story/outro/kitsune-illusion-academy.jpg',
    dialogue: [
      {
        speaker: 'Yuki',
        speakerPieceId: 'kitsune-trickster',
        text: 'Aww, you fell for the fake smile. Don\'t feel bad—my illusions are very pretty.',
        position: 'right',
      },
    ],
  },

  'intro-celestial-mage-collegium': {
    id: 'intro-celestial-mage-collegium',
    backgroundImage: 'story/intro/celestial-mage-collegium.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Match 6. Celestial Mage Collegium. Students here calculate star charts before every opening.',
        position: 'center',
      },
      {
        speaker: 'Luna',
        speakerPieceId: 'celestial-mage',
        text: 'Alishan Academy. Your constellation is... interesting. Small, but unusually bright.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'We didn\'t come here to read horoscopes, Luna. We came to rewrite them.',
        position: 'left',
      },
      {
        speaker: 'Luna',
        speakerPieceId: 'celestial-mage',
        text: 'Spoken like a comet that doesn\'t know it\'s burning out. Let the stars decide.',
        position: 'right',
      },
    ],
  },

  'outro-celestial-mage-collegium-victory': {
    id: 'outro-celestial-mage-collegium-victory',
    backgroundImage: 'story/outro/celestial-mage-collegium.jpg',
    dialogue: [
      {
        speaker: 'Luna',
        speakerPieceId: 'celestial-mage',
        text: 'The chart lied. Or perhaps... it simply hadn\'t seen you before.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'New stars are born every day, Luna. Today, ours outshone yours.',
        position: 'left',
      },
    ],
  },

  'outro-celestial-mage-collegium-defeat': {
    id: 'outro-celestial-mage-collegium-defeat',
    backgroundImage: 'story/outro/celestial-mage-collegium.jpg',
    dialogue: [
      {
        speaker: 'Luna',
        speakerPieceId: 'celestial-mage',
        text: 'As the stars predicted. Small lights fade quickly against true constellations.',
        position: 'right',
      },
    ],
  },

  'intro-final-boss-throne-academy': {
    id: 'intro-final-boss-throne-academy',
    backgroundImage: 'story/intro/final-boss-throne-academy.jpg',
    dialogue: [
      {
        speaker: 'Narrator',
        text: 'Final Match. Final Boss Throne Academy. The reigning champions, undefeated for three years, waiting atop a golden hall.',
        position: 'center',
      },
      {
        speaker: 'Victoria',
        speakerPieceId: 'demon-queen',
        text: 'Little Hana. Do you know why I\'ve been watching your matches? Because you remind me of someone I used to be.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Victoria... the national champion. What could we possibly have in common?',
        position: 'left',
      },
      {
        speaker: 'Victoria',
        speakerPieceId: 'demon-queen',
        text: 'Desperation. The night before my first championship, I prayed too. But nobody answered. So I became the answer.',
        position: 'right',
      },
      {
        speaker: 'Victoria',
        speakerPieceId: 'demon-queen',
        text: 'Beat me, and Alishan takes the cohort. Lose, and you\'ll learn why mercy is a luxury champions can\'t afford.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'I don\'t need mercy. I need my team. And they\'ve never let me pray alone.',
        position: 'left',
      },
    ],
  },

  'outro-final-boss-throne-academy-victory': {
    id: 'outro-final-boss-throne-academy-victory',
    backgroundImage: 'story/outro/final-boss-throne-academy.jpg',
    dialogue: [
      {
        speaker: 'Victoria',
        speakerPieceId: 'demon-queen',
        text: 'Checkmate. From a prayer-school. I would laugh if I weren\'t... proud.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'You\'re not alone, Victoria. Even on a throne. If you ever want to remember how to smile, Alishan\'s chapel is open.',
        position: 'left',
      },
      {
        speaker: 'Victoria',
        speakerPieceId: 'demon-queen',
        text: '...Idiot. Take your cohort. And take this too—my respect. It\'s heavier than it looks.',
        position: 'right',
      },
      {
        speaker: 'Narrator',
        text: 'Alishan Academy is crowned champion. The underdogs who prayed together, won together.',
        position: 'center',
      },
    ],
  },

  'outro-final-boss-throne-academy-defeat': {
    id: 'outro-final-boss-throne-academy-defeat',
    backgroundImage: 'story/outro/final-boss-throne-academy.jpg',
    dialogue: [
      {
        speaker: 'Victoria',
        speakerPieceId: 'demon-queen',
        text: 'Close. But close is where the hopeful go to die. Go home, Hana. Pray harder next year.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Next year... I won\'t be praying alone. Count on it.',
        position: 'left',
      },
    ],
  },

  'kira-taunt-1': {
    id: 'kira-taunt-1',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'One win. Cute. I\'ve seen first-years do better in practice matches.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'And I\'ve seen old friends forget how to be kind. Guess we\'re both disappointed.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Save the sermon. You\'re still six matches from me.',
        position: 'right',
      },
    ],
  },

  'kira-taunt-2': {
    id: 'kira-taunt-2',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Two down. The saccharine one must\'ve given you cavities.',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'We\'re winning. You\'re watching. Seems like the right arrangement.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Keep talking, vice-captain. You\'ll choke on those words eventually.',
        position: 'right',
      },
    ],
  },

  'kira-taunt-3': {
    id: 'kira-taunt-3',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Half the bracket gone and you\'re still standing. Fine. I\'ll admit that\'s mildly impressive.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Mildly? Kira, you used to clap whenever I solved a practice puzzle.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'That was before you chose hymns over me. Don\'t bring up the past unless you\'re ready to lose in it.',
        position: 'right',
      },
    ],
  },

  'kira-taunt-4': {
    id: 'kira-taunt-4',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'You\'re past the halfway mark. People are starting to say Alishan might actually belong here.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'We always belonged here. It just took the bracket a while to notice.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Spoken like someone who\'s never had the crown within reach and then watched it slip away.',
        position: 'right',
      },
    ],
  },

  'kira-taunt-5': {
    id: 'kira-taunt-5',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'One match left before me. The throne academy won\'t go easy. Neither will I.',
        position: 'right',
      },
      {
        speaker: 'Mira',
        speakerPieceId: 'queen',
        text: 'You\'re already scouting us? Worried?',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'Worried? I\'m making sure the finale is worth my time. Don\'t disappoint me, Hana.',
        position: 'right',
      },
    ],
  },

  'kira-taunt-6': {
    id: 'kira-taunt-6',
    backgroundImage: 'story/taunt/grounds.jpg',
    dialogue: [
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'You really did it. You carved through the whole cohort and came out clean.',
        position: 'right',
      },
      {
        speaker: 'Hana',
        speakerPieceId: 'king',
        text: 'Not clean. Just stubborn. You knew that about me once.',
        position: 'left',
      },
      {
        speaker: 'Kira',
        speakerPieceId: 'final-boss-queen',
        text: 'I did. And now I get to crush that stubbornness myself. Final match, Hana. No more prayers. Just us.',
        position: 'right',
      },
    ],
  },
};

export function getStoryScene(id: string | undefined): StoryScene | undefined {
  if (!id) return undefined;
  return STORY_SCENES[id];
}
