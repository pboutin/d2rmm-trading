const cubemainFilename = 'global\\excel\\cubemain.txt';
const cubemain = D2RMM.readTsv(cubemainFilename);

const uniqueitemsFilename = 'global\\excel\\uniqueitems.txt';
const uniqueitems = D2RMM.readTsv(uniqueitemsFilename);



/**
 * Calculates the input value for recipe balancing
 * @param {string} input - Input item name or code
 * @returns {number} - Calculated input value
 */
function calcInput(input) {
  if (!input) return 0;
  
  // Rune calculations (r1 = 1, r2 = 2, etc)
  if (input.startsWith('r') && input.length > 1) {
      const runeNumber = parseInt(input.substring(1));
      return runeNumber || 0;
  }
  
  // Default value for other items
  return 1;
}

/**
 * Adds a new recipe to the cube main data
 * @param {string} input1 - First input item
 * @param {string} input2 - Second input item
 * @param {string} input3 - Third input item
 * @param {string} input4 - Fourth input item
 * @param {string} output - Output item
 * @param {number} quantity - Output quantity
 * @param {string} mod - Additional modifier
 * @param {string} description - Recipe description
 */
function addRecipeNew(inputs, output, quantity, mod, description) {
  const recipe = {
      description,
      enabled: "1",
      version: "100",
      lvl: "100",
      ilvl: "1000",
      "*eol\r": "0"
  };

  for (let i = 0; i < inputs.length; i++) {
    recipe[`input ${i + 1}`] = inputs[i];
  }

  if (output) recipe["output"] = output;

  // Handle special case for socketed items
  if (output.includes("sockets")) {
      var sockets = output.slice(-1);
      recipe["output"] = output.slice(0, -9);
      recipe["mod 1"] = "sock";
      recipe["mod 1 min"] = sockets;
      recipe["mod 1 max"] = sockets;
  } else {
      if (output) recipe["output"] = output;
  }

  if (mod) recipe["mod 1"] = mod;

  recipe["numinputs"] = inputs.length;

  // Add recipe to cubemain data
  cubemain.rows.push(recipe);
}

// Add specific Titan's Revenge recipes
// ... existing code ...

// Add specific Titan's Revenge recipes
function addTitansRevengeRecipes() {
  // Recipe 1: Javelin + Vex + Scroll of Town Portal = Titan's Revenge

  addRecipeNew(
    ["jav", "r14", "tsc"],    // input 1
    "Titan's Revenge,eth", // "Titan's Revenge",       // output
    1,                       // quantity
    null,                    // mod
    "Buy Titan's Revenge for Dol" // description
);

  addRecipeNew(
      ["jav", "r13", "tsc"],    // input 1
      "Titan's Revenge,noe", // "Titan's Revenge",       // output
      1,                       // quantity
      null,                    // mod
      "Buy Titan's Revenge for Shael" // description
  );

  // Recipe 2: Titan's Revenge + Scroll of Town Portal = Um
  addRecipeNew(
      ["Titan's Revenge,noe", "tsc"], // "Titan's Revenge",       // input 1
      "r22",                   // output (Um)
      1,                       // quantity
      null,                    // mod
      "Sell Titan's Revenge for Um" // description
  );
  addRecipeNew(
    ["Titan's Revenge,eth", "tsc"], // "Titan's Revenge",       // input 1
    "r23",                   // output (Um)
    1,                       // quantity
    null,                    // mod
    "Sell Titan's Revenge for Um+" // description
  );

  addRecipeNew(
    ["cap", "r13", "tsc"], // "Titan's Revenge",       // input 1
    "Harlequin Crest,noe",                   // output (Um)
    1,                       // quantity
    null,                    // mod
    "Buy Shako for Dol" // description
  );
}

// Call the function to add the recipes
addTitansRevengeRecipes(); 

D2RMM.writeTsv(cubemainFilename, cubemain);