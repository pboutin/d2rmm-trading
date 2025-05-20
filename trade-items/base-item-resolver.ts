import ARMORS from "../ref-data/armors";
import WEAPONS from "../ref-data/weapons";

export interface BaseItem {
  name: string;
  code: string;
  variants: string[];
}

const BASE_ITEMS: BaseItem[] = [
  {
    name: "Amulet",
    code: "amu",
    variants: ["amu"],
  },
  {
    name: "Ring",
    code: "rin",
    variants: ["rin"],
  },
  {
    name: "Grand Charm",
    code: "cm3",
    variants: ["cm3"],
  },
];

const BASE_REDIRECTION_MAP = new Map<string, string>();

// Amazon javelins to regular javelins
["am5", "ama", "amf"].forEach((code) => BASE_REDIRECTION_MAP.set(code, "jav"));
// Amazon spears to regular spears
["am3", "am8", "amd"].forEach((code) => BASE_REDIRECTION_MAP.set(code, "spr"));
// Amazon pikes to regular pikes
["am4", "am9", "ame"].forEach((code) => BASE_REDIRECTION_MAP.set(code, "pik"));

ARMORS.rows.forEach((armor) => {
  if (armor.code !== armor.normcode) return;

  BASE_ITEMS.push({
    name: armor.name,
    code: armor.code,
    variants: [armor.normcode, armor.ubercode, armor.ultracode],
  });
});

WEAPONS.rows.forEach((weapon) => {
  if (weapon.code !== weapon.normcode) return;

  BASE_ITEMS.push({
    name: weapon.name,
    code: weapon.code,
    variants: [weapon.normcode, weapon.ubercode, weapon.ultracode],
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
