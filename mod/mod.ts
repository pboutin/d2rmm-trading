const cubemainFilename = "global\\excel\\cubemain.txt";
const cubemain = D2RMM.readTsv(cubemainFilename);
const uniqueitemsFilename = "global\\excel\\uniqueitems.txt";
const uniqueitems = D2RMM.readTsv(uniqueitemsFilename);
const itemsFilename = "hd\\items\\items.json";
const items = D2RMM.readJson(itemsFilename);
const itemNamesFilename = "local\\lng\\strings\\item-names.json";
const itemNames = D2RMM.readJson(itemNamesFilename);
const miscFilename = "global\\excel\\misc.txt";
const misc = D2RMM.readTsv(miscFilename);

import ITEMS from "./items";
import RUNES from "./runes";
import FACETS from "./facets";
import SKILLERS from "./skillers";
import { SELLING_RATE, runesToCodes, valueToRunes } from "./shared";

const TP_SCROLL = "tsc";
const MANA_POT = "mpot";
const HEALTH_POT = "hpot";
const BASE_SKILLER_ITEM = uniqueitems.rows.find(
  (row) => row.index === "Gheed's Fortune"
);

let nextUniqueItemId =
  Math.max(...uniqueitems.rows.map((row) => parseInt(row["*ID"], 10))) + 1;

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

items.push({
  cm9: { asset: "charm/charm_large" },
});

function declareSkiller(name: string, skillCode: string) {
  const itemCode = "cm9";

  misc.rows.push({
    ...misc.rows.find((row) => row.name === "Grand Charm"),
    name: name,
    level: "50",
    code: itemCode,
    unique: "1",
    NightmareUpgrade: "xxx",
    HellUpgrade: "xxx",
  });

  uniqueitems.rows.push({
    ...BASE_SKILLER_ITEM,
    index: name,
    "*ID": `${nextUniqueItemId++}`,
    lvl: "1",
    "lvl req": "50",
    code: itemCode,
    "cost mult": "1",
    "cost add": "1",
    nolimit: "1",
    carry1: "",
    prop1: "skilltab",
    par1: skillCode,
    min1: "1",
    max1: "1",
    prop2: null,
    par2: null,
    min2: null,
    max2: null,
    prop3: null,
    par3: null,
    min3: null,
    max3: null,
    prop4: null,
    par4: null,
    min4: null,
    max4: null,
  });

  itemNames.push({
    id: D2RMM.getNextStringID(),
    Key: name,
    enUS: name,
    zhTW: name,
    deDE: name,
    esES: name,
    frFR: name,
    itIT: name,
    koKR: name,
    plPL: name,
    esMX: name,
    jaJP: name,
    ptBR: name,
    ruRU: name,
    zhCN: name,
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

  declareRecipe(
    [recipe.itemName, TP_SCROLL, HEALTH_POT, MANA_POT],
    [recipe.itemName, TP_SCROLL, HEALTH_POT, MANA_POT],
    `Rerolling ${recipe.itemName}`
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

  // declareRecipe(
  //   [facet.deathCode, TP_SCROLL],
  //   [...runesToCodes(valueToRunes(facet.value * SELLING_RATE)), TP_SCROLL],
  //   `Selling ${facet.name} (Death)`
  // );
  // declareRecipe(
  //   [facet.levelCode, TP_SCROLL],
  //   [...runesToCodes(valueToRunes(facet.value * SELLING_RATE)), TP_SCROLL],
  //   `Selling ${facet.name} (Level up)`
  // );
});

SKILLERS.forEach(({ name, skillCode, value, gem }) => {
  const skillerName = `Crafted ${name}`;
  declareSkiller(skillerName, skillCode);
  declareRecipe(
    [...runesToCodes(valueToRunes(value)), gem, TP_SCROLL],
    [skillerName, gem, TP_SCROLL],
    `Buying ${skillerName}`
  );
  declareRecipe(
    [skillerName, TP_SCROLL],
    [...runesToCodes(valueToRunes(value * SELLING_RATE)), TP_SCROLL],
    `Selling ${skillerName}`
  );
});

D2RMM.writeTsv(miscFilename, misc);
D2RMM.writeTsv(cubemainFilename, cubemain);
D2RMM.writeTsv(uniqueitemsFilename, uniqueitems);
D2RMM.writeJson(itemsFilename, items);
D2RMM.writeJson(itemNamesFilename, itemNames);
