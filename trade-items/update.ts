import fs from "fs";
import prompts from "prompts";
import RELEVANT_ITEMS from "../maxroll-build-items/items";
import UNIQUES from "../ref-data/uniques";
import { TradeItem } from "./types";
import resolveValue from "./traderic-value-resolver";
import resolveBaseItem from "./base-item-resolver";

(async () => {
  const items: TradeItem[] = [];

  for (const itemName of RELEVANT_ITEMS.noe) {
    const item = UNIQUES.rows.find((row) => row["index"] === itemName);

    if (!item) {
      console.warn(`Item ${itemName} not found in uniques`);
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

    items.push({
      itemName,
      baseItem,
      value,
      ethereal: false,
    });
  }

  fs.writeFileSync("./trade-items.json", JSON.stringify(items, null, 2));

  console.log("Donezo");
  console.log(`Processed ${items.length}/${RELEVANT_ITEMS.noe.length} items`);
})();
