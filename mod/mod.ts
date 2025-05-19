const cubemainFilename = "global\\excel\\cubemain.txt";
const cubemain = D2RMM.readTsv(cubemainFilename);

import ITEMS from "./items";

const TP_SCROLL = "tsc";

const CURRENCY_CODE_MAP = {
  Amethyst: "am",
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
  [["Jah"], 360],
];

const RUNES_EXCHANGES = [
  [["Um", "Um", "Gul"], ["Vex"]],
  [["Gul", "Ist"], ["Vex"]]
]

function runesToCodes(runes) {
  return runes.map((rune) => CURRENCY_CODE_MAP[rune]);
}

function currencyInputs(value) {
  const closestCombo = PAYMENT_COMBOS.reduce((closestCombo, combo) => {
    const closestDiff = Math.abs(closestCombo[1] - value);
    const currentDiff = Math.abs(combo[1] - value);
    return currentDiff < closestDiff ? combo : closestCombo;
  }, PAYMENT_COMBOS[0]);

  return runesToCodes(closestCombo[0]);
}

function declareRecipe(inputs, outputs, description) {
  const recipe = {
    description,
    output: outputs[0],
    enabled: "1",
    version: "100",
    lvl: "100",
    ilvl: "1000",
    "*eol\r": "0",
  };

  if (outputs.length > 1) {
    recipe["output a"] = outputs[1];
  }

  if (outputs.length > 2) {
    recipe["output b"] = outputs[2];
  }

  for (let i = 0; i < inputs.length; i++) {
    recipe[`input ${i + 1}`] = inputs[i];
  }

  recipe["numinputs"] = inputs.length;

  // Add recipe to cubemain data
  cubemain.rows.push(recipe);
}

ITEMS.forEach((recipe) => {
  declareRecipe(
    [recipe.baseItem.code, ...currencyInputs(recipe.value), TP_SCROLL],
    [recipe.itemName, TP_SCROLL],
    `Buying ${recipe.itemName}`
  );

  declareRecipe(
    [recipe.itemName, TP_SCROLL],
    [...currencyInputs(recipe.value * 0.75), TP_SCROLL],
    `Selling ${recipe.itemName}`
  );
});

RUNES_EXCHANGES.forEach((exchange) => {
  declareRecipe(
    [...runesToCodes(exchange[0]), TP_SCROLL],
    [...runesToCodes(exchange[1]), TP_SCROLL],
    `Exchange ${exchange[0]} for ${exchange[1]}`
  );
});

D2RMM.writeTsv(cubemainFilename, cubemain);
