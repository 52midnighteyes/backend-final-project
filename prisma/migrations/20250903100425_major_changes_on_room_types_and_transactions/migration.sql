/*
  Warnings:

  - You are about to drop the column `room_id` on the `Pricings` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `room_type_id` to the `Pricings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_type_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `special_request` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "final_project"."Pricings" DROP CONSTRAINT "Pricings_room_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Transactions" DROP CONSTRAINT "Transactions_room_id_fkey";

-- AlterTable
ALTER TABLE "final_project"."Pricings" DROP COLUMN "room_id",
ADD COLUMN     "room_type_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "final_project"."Transactions" DROP COLUMN "notes",
DROP COLUMN "room_id",
ADD COLUMN     "room_type_id" TEXT NOT NULL,
ADD COLUMN     "special_request" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "final_project"."Users" ADD COLUMN     "identity_id" INTEGER,
ADD COLUMN     "phone_number" INTEGER;

-- CreateTable
CREATE TABLE "final_project"."Room_Type_Picture" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "room_type_id" TEXT NOT NULL,

    CONSTRAINT "Room_Type_Picture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "final_project"."Transactions" ADD CONSTRAINT "Transactions_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "final_project"."Room_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Pricings" ADD CONSTRAINT "Pricings_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "final_project"."Room_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type_Picture" ADD CONSTRAINT "Room_Type_Picture_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "final_project"."Room_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
