import fs from "fs";

export interface BaseItem {
  name: string;
  code: string;
  variants: string[];
}

const BASE_ITEMS: BaseItem[] = [];

const WEAPONS_TSV = fs.readFileSync("./ref-data/weapons.tsv", "utf8");
const ARMORS_TSV = fs.readFileSync("./ref-data/armor.tsv", "utf8");

const BASE_REDIRECTION_MAP = new Map<string, string>();

// Amazon javelins to regular javelins
["am5", "ama", "amf"].forEach((code) => BASE_REDIRECTION_MAP.set(code, "jav"));
// Amazon spears to regular spears
["am3", "am8", "amd"].forEach((code) => BASE_REDIRECTION_MAP.set(code, "spr"));
// Amazon pikes to regular pikes
["am4", "am9", "ame"].forEach((code) => BASE_REDIRECTION_MAP.set(code, "pik"));

ARMORS_TSV.split("\n").forEach((line) => {
  const values = line.split("\t");

  const name = values[0];
  const code = values[18];
  const normCode = values[23];
  const exceptionalCode = values[24];
  const eliteCode = values[25];

  if (code !== normCode) return;

  BASE_ITEMS.push({
    name,
    code,
    variants: [normCode, exceptionalCode, eliteCode],
  });
});

WEAPONS_TSV.split("\n").forEach((line) => {
  const values = line.split("\t");

  const name = values[0];
  const code = values[3];
  const normCode = values[37];
  const exceptionalCode = values[38];
  const eliteCode = values[39];

  if (code !== normCode) return;

  BASE_ITEMS.push({
    name,
    code,
    variants: [normCode, exceptionalCode, eliteCode],
  });
});

const resolveBaseItem = (itemCode: string): BaseItem | null => {
  const targetCode = BASE_REDIRECTION_MAP.get(itemCode) ?? itemCode;

  const baseItem = BASE_ITEMS.find((item) =>
    item.variants.includes(targetCode)
  );

  return baseItem ?? null;
};

export default resolveBaseItem;
