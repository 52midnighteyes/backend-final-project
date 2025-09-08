/*
  Warnings:

  - Added the required column `property_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "final_project"."Transactions" ADD COLUMN     "property_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "final_project"."Transactions" ADD CONSTRAINT "Transactions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
