import UNIQUE_ITEMS from "../ref-data/uniques";
import SET_ITEMS from "../ref-data/sets";

export interface Item {
  name: string;
  code: string;
}

const TYPO_MAP: Record<string, string> = {
  "Valkyrie Wing": "Valkiry Wing",
  "Tal Rasha's Fine-Spun Cloth": "Tal Rasha's Fire-Spun Cloth",
  "War Traveler": "Wartraveler",
  "Thundergod's Vigor": "Thudergod's Vigor",
  "Verdungo's Hearty Cord": "Verdugo's Hearty Cord",
  "Gore Rider": "Gorerider",
  "Moser's Blessed Circle": "Mosers Blessed Circle",
  "Peasant Crown": "Peasent Crown",
  "Bul-Kathos' Wedding Band": "Bul Katho's Wedding Band",
  "Wisp Projector": "Wisp",
  "Spectral Shard": "Irices Shard",
  "Vampire Gaze": "Vampiregaze",
  "Eschuta's Temper": "Eschuta's temper",
  "Cerebus' Bite": "Cerebus",
};

const ITEMS: Item[] = [];

UNIQUE_ITEMS.rows.forEach((unique) => {
  const name = unique.index;
  const code = unique.code;

  ITEMS.push({
    name,
    code,
  });
});

SET_ITEMS.rows.forEach((set) => {
  const name = set.index;
  const code = set.item;

  ITEMS.push({
    name,
    code,
  });
});

const resolveItem = (itemName: string): Item | null => {
  const normalizedName = TYPO_MAP[itemName] ?? itemName;
  const item = ITEMS.find((item) => item.name === normalizedName);

  return item ?? null;
};

export default resolveItem;
