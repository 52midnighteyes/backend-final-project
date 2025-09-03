/*
  Warnings:

  - You are about to drop the column `property_id` on the `Bed_Type` table. All the data in the column will be lost.
  - You are about to drop the column `property_id` on the `Pricing` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Pricing` table. All the data in the column will be lost.
  - You are about to drop the column `base_price` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `property_id` on the `Room_Type` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `room_id` to the `Pricing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_price` to the `Room_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bed_type_id` to the `Room_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Room_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Room_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Room_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "final_project"."User_Role" AS ENUM ('USER', 'TENANT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "final_project"."Bed_Type" DROP CONSTRAINT "Bed_Type_property_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Pricing" DROP CONSTRAINT "Pricing_property_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room" DROP CONSTRAINT "Room_bed_type_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room_Type" DROP CONSTRAINT "Room_Type_property_id_fkey";

-- AlterTable
ALTER TABLE "final_project"."Bed_Type" DROP COLUMN "property_id";

-- AlterTable
ALTER TABLE "final_project"."Pricing" DROP COLUMN "property_id",
DROP COLUMN "type",
ADD COLUMN     "room_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "final_project"."Room" DROP COLUMN "base_price",
DROP COLUMN "capacity",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "final_project"."Room_Type" DROP COLUMN "property_id",
ADD COLUMN     "base_price" INTEGER NOT NULL,
ADD COLUMN     "bed_type_id" TEXT NOT NULL,
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "size" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "final_project"."Transaction" ADD COLUMN     "notes" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "final_project"."User" DROP COLUMN "role",
ADD COLUMN     "role" "final_project"."User_Role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "final_project"."UserRole";

-- CreateTable
CREATE TABLE "final_project"."Room_Type_Facility" (
    "room_type_id" TEXT NOT NULL,
    "room_facility_id" TEXT NOT NULL,

    CONSTRAINT "Room_Type_Facility_pkey" PRIMARY KEY ("room_type_id","room_facility_id")
);

-- CreateTable
CREATE TABLE "final_project"."Room_Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Room_Facility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "final_project"."Pricing" ADD CONSTRAINT "Pricing_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "final_project"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type" ADD CONSTRAINT "Room_Type_bed_type_id_fkey" FOREIGN KEY ("bed_type_id") REFERENCES "final_project"."Bed_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type_Facility" ADD CONSTRAINT "Room_Type_Facility_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "final_project"."Room_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type_Facility" ADD CONSTRAINT "Room_Type_Facility_room_facility_id_fkey" FOREIGN KEY ("room_facility_id") REFERENCES "final_project"."Room_Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
