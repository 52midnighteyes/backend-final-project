/*
  Warnings:

  - Added the required column `type` to the `Pricings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "final_project"."Pricings" ADD COLUMN     "type" "final_project"."Pricing_type" NOT NULL;
