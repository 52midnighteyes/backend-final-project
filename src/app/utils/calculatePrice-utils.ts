import { Decimal } from "@prisma/client/runtime/library";

export function roomAndAddOnsCalculator(
  roomTotal: Decimal,
  nights: number,
  addOns: { id: string; name: string; price: Decimal }[]
) {
  const addOnTotal = addOns.reduce(
    (acc, curr) => acc.plus(curr.price.mul(nights)),
    new Decimal(0)
  );
  return roomTotal.plus(addOnTotal);
}
