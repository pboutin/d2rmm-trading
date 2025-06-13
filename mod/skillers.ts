const CLASS_GEM_MAPPING = {
  Amazon: "gpy", // Topaz
  Barbarian: "gpr", // Ruby
  Necromancer: "skz", // Skull
  Paladin: "gpw", // Diamond
  Druid: "gpg", // Emerald
  Sorceress: "gpv", // Amethyst
  Assassin: "gpb", // Sapphire
};

/**
AMAZON
0 - Bow & Crossbow
1 - Passive & Magic
2 - Spear & Javelin
SORCERESS
3 - Fire
4 - Lightning
5 - Cold
NECROMANCER
6 - Curses
7 - Poison & Bone
8 - Summoning
PALADIN
9 - Combat Skills
10 - Offensive Auras
11 - Defensive Auras
BARBARIAN
12 - Combat Skills
13 - Masteries
14 - Warcries
DRUID
15 - Summoning
16 - Shapeshifting
17 - Elemental
ASSASSIN
18 - Traps
19 - Shadow Disciplines
20 - Martial Arts 
 */

export default [
  {
    name: "Harpoonist's",
    skillCode: "2",
    value: 20,
    gem: CLASS_GEM_MAPPING.Amazon,
  },
  {
    name: "Chilling",
    skillCode: "5",
    value: 20,
    gem: CLASS_GEM_MAPPING.Sorceress,
  },
  {
    name: "Sparking",
    skillCode: "4",
    value: 20,
    gem: CLASS_GEM_MAPPING.Sorceress,
  },
  {
    name: "Shogukusha's",
    skillCode: "20",
    value: 20,
    gem: CLASS_GEM_MAPPING.Assassin,
  },
];
