const cubemainFilename = "global\\excel\\cubemain.txt";
const cubemain = D2RMM.readTsv(cubemainFilename);

import ITEMS from "./items";
import RUNES from "./runes";
import FACETS from "./facets";

import { SELLING_RATE, runesToCodes, valueToRunes } from "./shared";

const TP_SCROLL = "tsc";
const MANA_POT = "mpot";
const HEALTH_POT = "hpot";

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

function declareRecipe(
  inputs: string[],
  outputs: string[],
  description: string,
  additional: Record<string, string> = {}
) {
  const effectiveInputs = adjustDuplicateCodes(inputs);
  const effectiveOutputs = adjustDuplicateCodes(outputs);

  const recipe = {
    description,
    output: effectiveOutputs[0],
    enabled: "1",
    version: "100",
    lvl: "100",
    ilvl: "1000",
    ...additional,
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
    [...runesToCodes(valueToRunes(recipe.value * SELLING_RATE)), TP_SCROLL],
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

FACETS.forEach((facet) => {
  declareRecipe(
    [...runesToCodes(valueToRunes(facet.value)), HEALTH_POT, TP_SCROLL],
    [facet.deathCode, TP_SCROLL],
    `Buying ${facet.name} (Death)`
  );
  declareRecipe(
    [...runesToCodes(valueToRunes(facet.value)), MANA_POT, TP_SCROLL],
    [facet.levelCode, TP_SCROLL],
    `Buying ${facet.name} (Level up)`
  );

  declareRecipe(
    [facet.deathCode, TP_SCROLL],
    [...runesToCodes(valueToRunes(facet.value * SELLING_RATE)), TP_SCROLL],
    `Selling ${facet.name} (Death)`
  );
  declareRecipe(
    [facet.levelCode, TP_SCROLL],
    [...runesToCodes(valueToRunes(facet.value * SELLING_RATE)), TP_SCROLL],
    `Selling ${facet.name} (Level up)`
  );
});

// Test skillers
declareRecipe(["isc", TP_SCROLL], ["cm3,mag"], "Test skillers", {
  "mod 1": "skilltab",
  "mod 1 min": "2",
  "mod 1 max": "2",
});

D2RMM.writeTsv(cubemainFilename, cubemain);
