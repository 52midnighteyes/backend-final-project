import { Decimal } from "@prisma/client/runtime/library";
import { IPricing } from "../interfaces/transactions.interface";
import { AppError } from "../classes/appError.class";

export function toMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export function enumerateNights(start: Date, end: Date): Date[] {
  const s = toMidnight(start);
  const e = toMidnight(end);
  if (e <= s) throw new AppError(422, "end_date must be after start_date");

  const days: Date[] = [];
  for (let d = new Date(s); d < e; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
}

export function isDateInRange(day: Date, start_date: Date, end_date: Date) {
  const s = toMidnight(start_date);
  const e = toMidnight(end_date);
  const d = toMidnight(day);

  return d >= s && d <= e;
}

export function roomPriceCalculator(
  basePrice: Decimal,
  start_date: Date,
  end_date: Date,
  pricings: IPricing[]
) {
  let nights = enumerateNights(start_date, end_date) as Date[];
  let totalPrice = new Decimal(0);

  for (const day of nights) {
    const pricing = pricings.find((p) =>
      isDateInRange(day, p.start_date, p.end_date)
    );

    if (pricing && !pricing.is_rentable) {
      const ds = toMidnight(day).toISOString().slice(0, 10);
      throw new AppError(422, `Room at ${ds} is not rentable`);
    }

    if (!pricing) {
      totalPrice = totalPrice.plus(basePrice);
    } else if (pricing.type === "PERCENTAGE") {
      const discounted = basePrice.mul(
        new Decimal(1).minus(pricing.value.div(100))
      );
      totalPrice = totalPrice.plus(discounted);
    } else {
      const discounted = basePrice.minus(pricing.value);
      totalPrice = totalPrice.plus(
        discounted.greaterThan(0) ? discounted : new Decimal(0)
      );
    }
  }

  return { nights: nights.length, totalPrice };
}
