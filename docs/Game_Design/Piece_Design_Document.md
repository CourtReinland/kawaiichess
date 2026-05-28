# Piece Design Document - Kawaii Ouroboros

**Project**: Cute Anime Chess Roguelike  
**Version**: v4 (2026-05-27)  
**Pieces Defined**: 55

## Design Goals
- Strong personality and visual identity for every piece
- Tactical depth through synergies and positioning
- Clear progression and evolution paths
- Balanced mix of offensive, defensive, and utility pieces

---

## Piece Categories

### Offensive (High Damage / Aggression)
### Defensive (Protection / Sustain)
### Support (Buffs / Utility)
### Trickster / Control

---

## Full Piece List (v4)

### Tier 1 – Common (15 pieces)

| # | Name                    | Move          | Ability                                      | Category    | Theme          |
|---|-------------------------|---------------|----------------------------------------------|-------------|----------------|
| 1 | Magical Girl Rook       | Rook          | Barrier on adjacent ally                     | Defensive   | Magical Girl   |
| 2 | Ninja Knight            | Knight        | Shadow Step (2 uses)                         | Trickster   | Ninja          |
| 3 | Idol Bishop             | Bishop        | Fan Service buff                             | Support     | Idol           |
| 4 | Dragon Princess         | King + fly    | Promotes to Dragon Queen                     | Offensive   | Dragon         |
| 5 | Shrine Maiden           | Bishop        | Purify debuffs                               | Support     | Miko           |
| 6 | Schoolgirl Pawn         | Pawn          | Flexible promotion                           | Utility     | Schoolgirl     |
| 7 | Maid Knight             | Knight        | Remove hazards                               | Utility     | Maid           |
| 8 | Tennis Bishop           | Bishop        | Push enemy 1 square                          | Control     | Sporty         |
| 9 | Bookworm Rook           | Rook          | +1 range after capture                       | Offensive   | Library        |
|10 | Catgirl Pawn            | Pawn          | Diagonal forward always                      | Utility     | Catgirl        |
|11 | Cheerleader             | King          | Temporary attack buff                        | Support     | Cheerleader    |
|12 | Piano Bishop            | Bishop        | Stun line attack                             | Control     | Musician       |
|13 | Library Assistant       | Bishop        | Can swap two adjacent pieces                 | Trickster   | Library        |
|14 | Track Star              | Rook (short)  | Can move twice in one turn (once per battle) | Offensive   | Athlete        |
|15 | Baker                   | King          | Heals one adjacent ally                      | Support     | Baker          |

### Tier 2 – Specialized (25 pieces)

| # | Name                    | Move               | Ability                                              | Category    | Theme             |
|---|-------------------------|--------------------|------------------------------------------------------|-------------|-------------------|
|16 | Sakura Assassin         | Knight + jump      | Chain up to 3 attacks + blocking petals              | Offensive   | Assassin          |
|17 | Celestial Mage          | Bishop             | Teleport + Star Portals                              | Support     | Mage              |
|18 | Valkyrie Paladin        | Rook               | Shield aura + King sacrifice heal                    | Defensive   | Valkyrie          |
|19 | Kitsune Trickster       | 2-square King      | Position swap + illusion                             | Trickster   | Kitsune           |
|20 | Thunder Samurai         | Rook               | Dash through multiple enemies                        | Offensive   | Samurai           |
|21 | Candy Witch             | Bishop             | Slow enemy on hit                                    | Control     | Witch             |
|22 | Mecha Knight            | Knight             | Self-destruct (area damage)                          | Offensive   | Mecha             |
|23 | Forest Archer           | Bishop (range)     | Shoot over pieces + high ground bonus                | Offensive   | Archer            |
|24 | Phantom Thief           | Knight             | Steal gold/relic on capture                          | Trickster   | Thief             |
|25 | Onsen Healer            | King               | Heal adjacent allies every turn                      | Support     | Onsen             |
|26 | Snowboarder             | Rook (slide)       | Slide and knock back enemies                         | Control     | Winter Sports     |
|27 | Magical Chef            | Bishop             | Grant temporary stat boost                           | Support     | Chef              |
|28 | Spy Master              | King + 1           | Reveal all enemy abilities                           | Utility     | Spy               |
|29 | Bunny Girl              | Knight             | Extra hop on capture                                 | Offensive   | Bunny             |
|30 | Gardener                | Bishop             | Plant healing flowers                                | Support     | Gardener          |
|31 | Pirate Captain          | Rook               | Board near enemy King (once)                         | Offensive   | Pirate            |
|32 | Scientist               | Bishop             | Mark enemy for extra damage                          | Control     | Scientist         |
|33 | Fashion Model           | King               | Distract nearby enemies                              | Control     | Model             |
|34 | Karate Girl             | Rook (short)       | Powerful forward strike                              | Offensive   | Martial Arts      |
|35 | Mermaid                 | Bishop (water)     | Can move through water tiles freely                  | Utility     | Mermaid           |
|36 | Ghost Girl              | King              | Can phase through one enemy per turn                 | Trickster   | Ghost             |
|37 | Alchemist               | Bishop             | Transform one piece into another (temporary)         | Utility     | Alchemist         |
|38 | Racer                   | Rook               | Can move extra far in straight lines                 | Offensive   | Racer             |
|39 | Shrine Guardian         | Rook               | Reflects one attack per battle                       | Defensive   | Guardian          |
|40 | Pop Star                | Bishop             | Area charm (enemies skip turn)                       | Control     | Pop Star          |

### Tier 3 – Rare & Legendary (15 pieces)

| # | Name                    | Move               | Ability                                                  | Category    | Theme             |
|---|-------------------------|--------------------|----------------------------------------------------------|-------------|-------------------|
|41 | Eternal Queen           | Queen              | Time Rewind (once per run)                               | Support     | Eternal           |
|42 | Moonlight Reaper        | Extended Knight    | Long-range capture + ally death power                    | Offensive   | Reaper            |
|43 | Sunflower Paladin       | Rook               | Constant healing aura                                    | Defensive   | Sunflower         |
|44 | Void Princess           | Queen (short)      | Banish enemy (once per battle)                           | Control     | Void              |
|45 | Crystal Oracle          | Bishop             | Reveal next enemy moves                                  | Utility     | Oracle            |
|46 | Blazing Oni             | Rook               | Line charge attack                                       | Offensive   | Oni               |
|47 | Starlight Idol          | Bishop             | Major team-wide buff on capture                          | Support     | Super Idol        |
|48 | Necromancer-chan        | Bishop             | Raise fallen enemies as allies                           | Support     | Necromancer       |
|49 | Guardian Angel          | King               | Intercept lethal attack on King                          | Defensive   | Angel             |
|50 | Demon Queen             | Queen              | Sacrifice HP for massive movement                        | Offensive   | Demon Queen       |
|51 | Time Traveler           | Any (once)         | Return to previous position (once per run)               | Trickster   | Time Travel       |
|52 | Cosmic Dragon           | Queen + fly        | Fly + star fire cone attack                              | Offensive   | Cosmic Dragon     |
|53 | Holy Knight             | Rook               | Can revive one fallen ally (once per run)                | Support     | Holy Knight       |
|54 | Eclipse Sorceress       | Bishop             | Switch day/night mode affecting all pieces               | Control     | Sorceress         |
|55 | Final Boss Queen        | Queen              | Multiple powerful abilities (boss only)                  | Offensive   | Final Boss        |

---

## Evolution Trees (v4)

- **Dragon Tree**: Dragon Princess → Dragon Queen → Cosmic Dragon
- **Assassin Tree**: Ninja Knight → Sakura Assassin → Moonlight Reaper
- **Support Tree**: Idol Bishop → Starlight Idol → Eternal Queen
- **Defense Tree**: Valkyrie Paladin → Sunflower Paladin → Guardian Angel
- **Trickster Tree**: Kitsune Trickster → Phantom Thief → Time Traveler
- **Healer Tree**: Onsen Healer → Sunflower Paladin → Holy Knight
- **Control Tree**: Candy Witch → Void Princess → Eclipse Sorceress

---

## Key Synergies

- **Celestial Mage + Kitsune Trickster** → Insane mobility
- **Sunflower Paladin + Valkyrie Paladin** → Extremely tanky core
- **Necromancer-chan + aggressive builds** → Value from sacrifices
- **Starlight Idol + capture-focused armies** → Snowball potential
- **Crystal Oracle + high-damage pieces** → Perfect information advantage

---

**Next (v5)**: 60+ pieces, more detailed ability descriptions, starting loadout recommendations, and counter relationships.

**Current Version**: v4 – 55 pieces (2026-05-27)