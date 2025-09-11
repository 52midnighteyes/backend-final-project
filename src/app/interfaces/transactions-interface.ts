import { Decimal } from "@prisma/client/runtime/library";
import { Pricing_type } from "@prisma/client";

export interface ICreateTransaction {
  user_id: string;
  property_id: string;
  room_type_id: string;
  special_request: string;
  start_date: Date;
  end_date: Date;
  add_on: { id: string; name: string; price: Decimal }[];
}

export interface IPricing {
  value: Decimal;
  type: Pricing_type;
  is_rentable: boolean;
  start_date: Date;
  end_date: Date;
}
