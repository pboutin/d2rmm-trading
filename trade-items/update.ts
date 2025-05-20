import fs from "fs";

import RELEVANT_ITEMS from "../maxroll-build-items/items";
import IGNORED_ITEMS from "./ignored-items";
import { TradeItem } from "./types";
import resolveValue from "./traderic-value-resolver";
import resolveBaseItem from "./base-item-resolver";
import resolveItem from "./item-resolver";

(async () => {
  const items: TradeItem[] = [];
  const conflictMap = new Map<string, TradeItem>();
  let processingCount = 0;

  for (const itemName of RELEVANT_ITEMS.noe) {
    if (IGNORED_ITEMS.includes(itemName)) {
      continue;
    }

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

    conflictMap.set(key, tradeItem);
    items.push(tradeItem);
  }

  fs.writeFileSync(
    "./mod/items.ts",
    `export default ${JSON.stringify(items, null, 2)};`
  );

  console.log("\n\nDonezo");
  console.log(`Processed ${items.length}/${processingCount} items`);
})();
