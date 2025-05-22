import fs from "fs";

import RELEVANT_ITEMS from "../ref-data/relevant-items";
import { TradeItem } from "./types";
import resolveValue from "./traderic-value-resolver";
import resolveBaseItem from "./base-item-resolver";
import resolveItem from "./item-resolver";
import { PAYMENT_COMBOS, valueToRunes } from "../mod/shared";
import RUNES from "../mod/runes";
import FACETS from "../mod/facets";

(async () => {
  const items: TradeItem[] = [];
  const markdownLines: string[] = [];
  const conflictMap = new Map<string, TradeItem>();
  let processingCount = 0;

  for (const itemName of RELEVANT_ITEMS.noe) {
    processingCount++;

    let item = resolveItem(itemName);

    if (!item) {
      console.warn(`Item ${itemName} not found`);
      continue;
    }

    const value = resolveValue(itemName);

    if (!value) {
      console.warn(`Value for ${itemName} not found`);
      continue;
    }

    const baseItem = resolveBaseItem(item.code);

    if (!baseItem) {
      console.warn(`Base item not found for ${itemName}`);
      continue;
    }

    const key = `${baseItem.code}:${value}`;

    if (conflictMap.has(key)) {
      console.warn(
        `Conflict for "${itemName}" with "${
          conflictMap.get(key)?.itemName
        }" (${key})`
      );
      continue;
    }

    const tradeItem: TradeItem = {
      itemName: item.name,
      baseItem,
      value,
      ethereal: false,
    };

    markdownLines.push(
      `${baseItem.name} + ${valueToRunes(value).join(
        " + "
      )} + TP :point_right: ${item.name}\n\n${
        item.name
      } + TP :point_right: ${valueToRunes(value * 0.7).join(" + ")}`
    );

    conflictMap.set(key, tradeItem);
    items.push(tradeItem);
  }

  fs.writeFileSync(
    "./mod/items.ts",
    `export default ${JSON.stringify(items, null, 2)};`
  );

  fs.writeFileSync("./items.md", markdownLines.join("\n\n____________\n\n"));

  fs.writeFileSync(
    "./facets.md",
    `# Facets\n\n${FACETS.map(
      (f) =>
        `${valueToRunes(f.value).join(" + ")} + Health Pot + TP :point_right: ${
          f.name
        } (Death)\n\n${valueToRunes(f.value).join(
          " + "
        )} + Mana Pot + TP :point_right: ${f.name} (Level up)`
    ).join("\n\n\n\n")}`
  );

  fs.writeFileSync(
    "./runes.md",
    `# Values\n\n| Runes | Value |\n| --- | --- |\n${PAYMENT_COMBOS.map(
      ([runes, value]) => `| ${runes.join(" + ")} | ${value} |`
    ).join("\n")}\n\n# Trades\n\n${Array.from(Object.entries(RUNES))
      .map(
        ([rune, recipes]) =>
          `## ${rune}\n${recipes.map((v) => v.join(" + ")).join("\n\n")}`
      )
      .join("\n\n\n\n")}`
  );

  console.log("\n\nDonezo");
  console.log(`Processed ${items.length}/${processingCount} items`);
})();
