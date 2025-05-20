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

export function runesToCodes(runes) {
  return runes.map((rune) => CURRENCY_CODE_MAP[rune]);
}

export function valueToRunes(value) {
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
