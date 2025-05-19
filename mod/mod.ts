const cubemainFilename = "global\\excel\\cubemain.txt";
const cubemain = D2RMM.readTsv(cubemainFilename);

import ITEMS from "./items";
import RUNES from "./runes";

const TP_SCROLL = "tsc";

const CURRENCY_CODE_MAP = {
  Amethyst: "gpv",
  Lem: "r20",
  Pul: "r21",
  Um: "r22",
  Mal: "r23",
  Ist: "r24",
  Gul: "r25",
  Vex: "r26",
  Ohm: "r27",
  Lo: "r28",
  Sur: "r29",
  Ber: "r30",
  Jah: "r31",
  Cham: "r32",
  Zod: "r33",
};

const JAH_VALUE = 360;

const PAYMENT_COMBOS: Array<[string[], number]> = [
  [["Amethyst"], 1],
  [["Lem"], 2],
  [["Pul"], 5],
  [["Um"], 10],
  [["Mal"], 15],
  [["Ist"], 20],
  [["Mal", "Um"], 25],
  [["Ist", "Um"], 30],
  [["Ist", "Mal"], 35],
  [["Gul"], 40],
  [["Vex"], 60],
  [["Ohm"], 80],
  [["Cham"], 100],
  [["Lo"], 120],
  [["Sur"], 140],
  [["Zod"], 160],
  [["Ohm", "Cham"], 180],
  [["Ber"], 200],
  [["Cham", "Sur"], 240],
  [["Zod", "Lo"], 280],
  [["Ber", "Lo"], 320],
  [["Jah"], JAH_VALUE],
];

function runesToCodes(runes) {
  return runes.map((rune) => CURRENCY_CODE_MAP[rune]);
}

function valueToRunes(value) {
  let balanceValue = value;

  const additionalRunes: string[] = [];

  if (value > JAH_VALUE) {
    additionalRunes.push("Jah");
    balanceValue -= JAH_VALUE;
  }

  const runes = PAYMENT_COMBOS.reduce((closestCombo, combo) => {
    const closestDiff = Math.abs(closestCombo[1] - balanceValue);
    const currentDiff = Math.abs(combo[1] - balanceValue);
    return currentDiff < closestDiff ? combo : closestCombo;
  }, PAYMENT_COMBOS[0])[0];

  return [...additionalRunes, ...runes];
}

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
    [...runesToCodes(valueToRunes(recipe.value * 0.75)), TP_SCROLL],
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
    runesToCodes([rune]),
    runesToCodes(exchanges[0]),
    `Exchange "${rune}" for "${exchanges[0].join(" + ")}"`
  );
});

D2RMM.writeTsv(cubemainFilename, cubemain);
