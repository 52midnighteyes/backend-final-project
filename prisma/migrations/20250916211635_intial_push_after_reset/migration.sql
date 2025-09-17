/*
  Warnings:

  - You are about to drop the column `priority_level` on the `Pricings` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "final_project"."Temporary_Token_Type" ADD VALUE 'REGISTRATION';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "final_project"."Transaction_Status" ADD VALUE 'ON_GOING';
ALTER TYPE "final_project"."Transaction_Status" ADD VALUE 'PAYMENT_PROOF_REJECTED';

-- AlterTable
ALTER TABLE "final_project"."Pricings" DROP COLUMN "priority_level";

-- DropEnum
DROP TYPE "final_project"."Pricing_priority";
