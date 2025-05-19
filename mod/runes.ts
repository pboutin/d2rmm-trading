export default {
  Jah: [
    ["Ber", "Zod"],
    ["Cham", "Sur", "Lo"],
  ],
  Ber: [
    ["Lo", "Ohm"],
    ["Zod", "Gul"],
    ["Sur", "Vex"],
    ["Cham", "Gul", "Vex"],
  ],
  Zod: [
    ["Cham", "Vex"],
    ["Sur", "Ist"],
    ["Lo", "Gul"],
  ],
  Sur: [
    ["Lo", "Ist"],
    ["Cham", "Gul"],
    ["Ohm", "Vex"],
  ],
  Lo: [
    ["Cham", "Ist"],
    ["Ohm", "Gul"],
  ],
  Cham: [
    ["Ohm", "Ist"],
    ["Vex", "Gul"],
  ],
  Ohm: [["Vex", "Ist"]],
  Vex: [["Gul", "Ist"]],
  Gul: [["Ist", "Mal", "Pul"]],
  Ist: [["Mal", "Pul"]],
};
