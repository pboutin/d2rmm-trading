import fs from "fs";
import prompts from "prompts";
import RELEVANT_ITEMS from "./maxroll-build-items/items";
import UNIQUES from "./ref-data/uniques";

const IGNORED_ITEMS: string[] = JSON.parse(
  fs.readFileSync("./ignored-names.json", "utf8")
);

const WEAPONS_TSV = fs.readFileSync("./ref-data/weapons.tsv", "utf8");
const ARMORS_TSV = fs.readFileSync("./ref-data/armor.tsv", "utf8");
const BASE_MAPPING = new Map();

WEAPONS_TSV.split("\n").forEach((line) => {
  const values = line.split("\t");
  const code = values[3];
  const normCode = values[37];

  BASE_MAPPING.set(code, normCode);
});

ARMORS_TSV.split("\n").forEach((line) => {
  const values = line.split("\t");
  const code = values[18];
  const normCode = values[23];
  BASE_MAPPING.set(code, normCode);
});

const resolveBaseItem = (itemName: string): string | null => {
  const unique = UNIQUES.rows.find((row) => row["index"] === itemName);
  if (!unique) return null;

  return BASE_MAPPING.get(unique.code) ?? unique.code;
};

(async () => {
  const items: TradeItem[] = JSON.parse(fs.readFileSync("items.json", "utf8"));

  for (const itemName of RELEVANT_ITEMS.noe) {
    if (IGNORED_ITEMS.includes(itemName)) continue;
    if (items.find((item) => item.item === itemName)) continue;

    const resolvedBaseItem = resolveBaseItem(itemName);
    const promptQuestions = [
      {
        type: "text",
        name: "baseItem",
        message: `Base item (${resolvedBaseItem})`,
        initial: resolvedBaseItem,
      },
      {
        type: "text",
        name: "value",
        message: `Trade value ${
          RELEVANT_ITEMS.eth.includes(itemName) ? "(WITH ETH)" : ""
        } (https://traderie.com/diablo2resurrected/products?search=${encodeURIComponent(
          itemName
        )})`,
      },
    ];

    const { baseItem, value } = await prompts(promptQuestions, {
      onCancel: () => {
        console.log("Cancelled");
        process.exit(0);
      },
    });

    if (!baseItem || !value) {
      console.log("Ignored.");
      IGNORED_ITEMS.push(itemName);
      fs.writeFileSync(
        "./ignored-names.json",

        JSON.stringify(IGNORED_ITEMS, null, 2)
      );
      continue;
    }

    const values = value.split(" ");

    items.push({
      item: itemName,
      baseItem,
      value: parseInt(values[0], 10),
      ethereal: false,
    });

    if (values[1]) {
      items.push({
        item: itemName,
        baseItem,
        value: parseInt(values[1], 10),
        ethereal: true,
      });
    }

    fs.writeFileSync("items.json", JSON.stringify(items, null, 2));
  }

  console.log("Donezo");
})();
