import type { AcademyDefinition } from './types';

export const ACADEMY_DEFINITIONS: AcademyDefinition[] = [
  {
    id: 'alishan',
    name: 'Alishan Academy',
    crestImage: 'alishan.jpg',
    uniformTheme: 'alishan',
    flavorText:
      'The prayer-clad underdogs of the national chess circuit, where faith and strategy walk hand in hand.',
    isPlayerSchool: true,
    backdropImage: 'alishan-backdrop.jpg',
  },
  {
    id: 'yami-no-gakuen',
    name: 'Yami no Gakuen',
    crestImage: 'yami-no-gakuen.jpg',
    uniformTheme: 'rival-dark',
    flavorText:
      'A gothic rival school that plays from the shadows and never smiles until checkmate.',
    backdropImage: 'yami-no-gakuen-backdrop.jpg',
    introSceneId: 'intro-yami-no-gakuen',
    outroSceneId: 'outro-yami-no-gakuen',
  },
  {
    id: 'seishin-high',
    name: 'Seishin High',
    crestImage: 'seishin-high.jpg',
    uniformTheme: 'rival-light',
    flavorText: 'Shrine-trained competitors who purify the board with calm, precise formations.',
    backdropImage: 'seishin-high-backdrop.jpg',
    introSceneId: 'intro-seishin-high',
    outroSceneId: 'outro-seishin-high',
  },
  {
    id: 'candy-forest-prep',
    name: 'Candy Forest Preparatory',
    crestImage: 'candy-forest-prep.jpg',
    uniformTheme: 'rival-light',
    flavorText: 'Sweet on the surface, but their saccharine traps are anything but childish.',
    backdropImage: 'candy-forest-prep-backdrop.jpg',
    introSceneId: 'intro-candy-forest-prep',
    outroSceneId: 'outro-candy-forest-prep',
  },
  {
    id: 'thunder-samurai-institute',
    name: 'Thunder Samurai Institute',
    crestImage: 'thunder-samurai-institute.jpg',
    uniformTheme: 'rival-dark',
    flavorText:
      'A disciplined dojo where every move is shouted like a kata and struck like lightning.',
    backdropImage: 'thunder-samurai-institute-backdrop.jpg',
    introSceneId: 'intro-thunder-samurai-institute',
    outroSceneId: 'outro-thunder-samurai-institute',
  },
  {
    id: 'kitsune-illusion-academy',
    name: 'Kitsune Illusion Academy',
    crestImage: 'kitsune-illusion-academy.jpg',
    uniformTheme: 'rival-light',
    flavorText: 'Tricksters in plaid who swap positions, bluff, and leave you chasing tails.',
    backdropImage: 'kitsune-illusion-academy-backdrop.jpg',
    introSceneId: 'intro-kitsune-illusion-academy',
    outroSceneId: 'outro-kitsune-illusion-academy',
  },
  {
    id: 'celestial-mage-collegium',
    name: 'Celestial Mage Collegium',
    crestImage: 'celestial-mage-collegium.jpg',
    uniformTheme: 'rival-dark',
    flavorText: 'Elite spellcasters who treat the board as a constellation to be rewritten.',
    backdropImage: 'celestial-mage-collegium-backdrop.jpg',
    introSceneId: 'intro-celestial-mage-collegium',
    outroSceneId: 'outro-celestial-mage-collegium',
  },
  {
    id: 'final-boss-throne-academy',
    name: 'Final Boss Throne Academy',
    crestImage: 'final-boss-throne-academy.jpg',
    uniformTheme: 'rival-dark',
    flavorText: 'The reigning champions. Arrogant, dramatic, and undefeated—until now.',
    backdropImage: 'final-boss-throne-academy-backdrop.jpg',
    introSceneId: 'intro-final-boss-throne-academy',
    outroSceneId: 'outro-final-boss-throne-academy',
  },
];

export const ACADEMY_BY_ID: Record<string, AcademyDefinition> = Object.fromEntries(
  ACADEMY_DEFINITIONS.map((a) => [a.id, a]),
);

export const PLAYER_ACADEMY_ID = 'alishan';

export function getAcademy(id: string): AcademyDefinition {
  return ACADEMY_BY_ID[id] ?? ACADEMY_BY_ID[PLAYER_ACADEMY_ID];
}
