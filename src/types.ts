import { BaseItem } from "./base-item-resolver";

export interface TradeItem {
  itemName: string;
  baseItem: BaseItem;
  value: number;
  ethereal: boolean;
}
