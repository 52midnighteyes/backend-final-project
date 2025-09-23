import { Decimal } from "@prisma/client/runtime/library";
import { IAddOn } from "../interfaces/transactions.interface";

export function roomAndAddOnsCalculator(
  roomTotal: Decimal,
  nights: number,
  addOns?: IAddOn[]
) {
  if (!addOns) return roomTotal;
  const addOnTotal = addOns.reduce(
    (acc, curr) => acc.plus(curr.price.mul(nights)),
    new Decimal(0)
  );
  return roomTotal.plus(addOnTotal);
}
