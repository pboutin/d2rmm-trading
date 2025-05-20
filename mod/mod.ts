const cubemainFilename = "global\\excel\\cubemain.txt";
const cubemain = D2RMM.readTsv(cubemainFilename);

import ITEMS from "./items";
import RUNES from "./runes";
import { runesToCodes, valueToRunes } from "./shared";

const TP_SCROLL = "tsc";

function adjustDuplicateCodes(codes: string[]) {
  const codeCountMap: Map<string, number> = codes.reduce(
    (acc: Map<string, number>, code) => {
      acc.set(code, (acc.get(code) ?? 0) + 1);
      return acc;
    },
    new Map()
  );

  return Array.from(codeCountMap.entries()).map(([code, count]) => {
    if (count === 1) return code;
    return `"${code},qty=${count}"`;
  });
}

function declareRecipe(inputs, outputs, description) {
  const effectiveInputs = adjustDuplicateCodes(inputs);
  const effectiveOutputs = adjustDuplicateCodes(outputs);

  const recipe = {
    description,
    output: effectiveOutputs[0],
    enabled: "1",
    version: "100",
    lvl: "100",
    ilvl: "1000",
    "*eol\r": "0",
  };

  if (effectiveOutputs.length > 1) {
    recipe["output b"] = effectiveOutputs[1];
  }

  if (effectiveOutputs.length > 2) {
    recipe["output c"] = effectiveOutputs[2];
  }

  for (let i = 0; i < effectiveInputs.length; i++) {
    recipe[`input ${i + 1}`] = effectiveInputs[i];
  }

  recipe["numinputs"] = effectiveInputs.length;

  // Add recipe to cubemain data
  cubemain.rows.push(recipe);
}

ITEMS.forEach((recipe) => {
  declareRecipe(
    [
      recipe.baseItem.code,
      ...runesToCodes(valueToRunes(recipe.value)),
      TP_SCROLL,
    ],
    [recipe.itemName, TP_SCROLL],
    `Buying ${recipe.itemName}`
  );

  declareRecipe(
    [recipe.itemName, TP_SCROLL],
    [...runesToCodes(valueToRunes(recipe.value * 0.7)), TP_SCROLL],
    `Selling ${recipe.itemName}`
  );
});

Array.from(Object.entries(RUNES)).forEach(([rune, exchanges]) => {
  exchanges.forEach((exchange) => {
    declareRecipe(
      [...runesToCodes(exchange), TP_SCROLL],
      [...runesToCodes([rune]), TP_SCROLL],
      `Exchange "${exchange.join(" + ")}" for "${rune}"`
    );
  });

  declareRecipe(
    [...runesToCodes([rune]), TP_SCROLL],
    [...runesToCodes(exchanges[0]), TP_SCROLL],
    `Exchange "${rune}" for "${exchanges[0].join(" + ")}"`
  );
});

D2RMM.writeTsv(cubemainFilename, cubemain);
