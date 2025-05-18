import * as cheerio from "cheerio";
import fs from "fs";

import MAXROLL_URLS from "./urls";
import d2ioItems from "../d2io-items/items";

(async () => {
  const itemNamesSet = d2ioItems.reduce((acc, item) => {
    acc.add(item.name);
    return acc;
  }, new Set<string>());

  const etherealRelevantItemNamesSet = new Set<string>();
  const relevantItemNamesSet = new Set<string>();

  for (const url of MAXROLL_URLS) {
    console.log(
      "Processing",
      url,
      "...(",
      MAXROLL_URLS.indexOf(url) + 1,
      "/",
      MAXROLL_URLS.length,
      ")"
    );
    const response = await fetch(url);

    const page = await response.text();

    const $ = cheerio.load(page);

    $("#essentials-header+div>div:first-child .d2planner-item").each(
      (_index, element) => {
        const $element = $(element);

        const itemName = $element.text().trim();

        if (itemName.startsWith("Ethereal ")) {
          if (itemNamesSet.has(itemName.replace("Ethereal ", ""))) {
            etherealRelevantItemNamesSet.add(itemName.slice(9));
          }
        } else if (itemNamesSet.has(itemName)) {
          relevantItemNamesSet.add(itemName);
        }
      }
    );
  }

  fs.writeFileSync(
    "./maxroll-build-items/items.ts",
    `export default ${JSON.stringify(
      {
        noe: Array.from(relevantItemNamesSet),
        eth: Array.from(etherealRelevantItemNamesSet),
      },
      null,
      2
    )}`
  );

  console.log("Total items count:", itemNamesSet.size);

  console.log("Relevant items count:", relevantItemNamesSet.size);

  console.log(
    "Ethereal relevant items count:",
    etherealRelevantItemNamesSet.size
  );
})();
