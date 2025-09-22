import { Decimal } from "@prisma/client/runtime/library";
import { Pricing_type, Transaction_Status } from "@prisma/client";

export interface ICreateTransaction {
  user_id: string;
  transaction_id: string;
  special_request: string;
  add_on: IAddOn[];
}

export interface IAddOn {
  id: string;
  name: string;
  price: Decimal;
}

export interface IPricing {
  value: Decimal;
  type: Pricing_type;
  is_rentable: boolean;
  start_date: Date;
  end_date: Date;
}

export interface IUploadPaymentProof {
  user_id: string;
  transaction_id: string;
  file: Express.Multer.File;
}

export interface IConfirmPayment {
  owner_id: string;
  transaction_id: string;
  status: TransactionStatus;
}

export type TransactionStatus = Transaction_Status;

export interface ICreateOnGoingTransaction {
  user_id: string;
  start_date: Date;
  end_date: Date;
  property_id: string;
  room_type_id: string;
}
