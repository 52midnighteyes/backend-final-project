import { Decimal } from "@prisma/client/runtime/library";

export interface IGetAllAddOnsParams {
  property_id: string;
  owner_id: string;
}

export interface ICreateAddOnsParams {
  owner_id: string;
  property_id: string;
  name: string;
  description: string;
  price: Decimal;
}
