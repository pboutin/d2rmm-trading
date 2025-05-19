import fs from "fs";

export interface Item {
  name: string;
  code: string;
}

const ITEMS: Item[] = [];

const UNIQUES_TSV = fs.readFileSync("./ref-data/uniqueitems.tsv", "utf8");
const SETS_TSV = fs.readFileSync("./ref-data/setitems.tsv", "utf8");

UNIQUES_TSV.split("\n").forEach((line) => {
  const values = line.split("\t");

  const name = values[0];
  const code = values[10];

  ITEMS.push({
    name,
    code,
  });
});

SETS_TSV.split("\n").forEach((line) => {
  const values = line.split("\t");

  const name = values[0];
  const code = values[3];

  ITEMS.push({
    name,
    code,
  });
});

const resolveItem = (itemName: string): Item | null => {
  const item = ITEMS.find((item) => item.name === itemName);

  return item ?? null;
};

export default resolveItem;
