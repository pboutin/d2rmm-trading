import fs from "fs";

const CURRENCY_VALUES = {
  "Perfect Amethyst": 1,
  "Lem(20)": 2,
  "Pul(21)": 5,
  "Um(22)": 10,
  "Mal(23)": 15,
  "Ist(24)": 20,
  "Gul(25)": 40,
  "Vex(26)": 60,
  "Ohm(27)": 80,
  "Lo(28)": 120,
  "Sur(29)": 140,
  "Ber(30)": 200,
  "Jah(31)": 360,
  "Cham(32)": 100,
  "Zod(33)": 160,
};

const OVERRIDES = {
  "Tal Rasha's Adjudication": 25,
  "Laying of Hands": 5,
};

const VALUE_MAP = new Map<string, number>();

const normalizeItemName = (itemName: string) => {
  return itemName.toLowerCase().replace(/[^a-z0-9]/g, "");
};

fs.readFileSync("./ref-data/traderic-recipes.txt", "utf8")
  .split("\n")
  .forEach((line) => {
    const match = line.match(
      / \+ (\w+\(\d+\)|Perfect Amethyst) x(\d+) (\+ Key |)\+ Scroll of Town Portal = ([' \-\w]+)/
    );

    if (!match) return;

    const currency = match[1];
    const currencyQuantity = parseInt(match[2], 10);
    const item = match[4];

    if (!CURRENCY_VALUES[currency]) return;

    const value = CURRENCY_VALUES[currency] * currencyQuantity;
    VALUE_MAP.set(normalizeItemName(item), value);
  });

const resolveValue = (itemName: string) => {
  if (OVERRIDES[itemName]) return OVERRIDES[itemName];
  return VALUE_MAP.get(normalizeItemName(itemName)) ?? null;
};

export default resolveValue;
