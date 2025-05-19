import UNIQUE_ITEMS from "../ref-data/uniques";
import SET_ITEMS from "../ref-data/sets";

export interface Item {
  name: string;
  code: string;
}

const TYPO_MAP: Record<string, string> = {
  'Valkyrie Wing': 'Valkiry Wing',
  'Tal Rasha\'s Fine-Spun Cloth': 'Tal Rasha\'s Fire-Spun Cloth',
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
