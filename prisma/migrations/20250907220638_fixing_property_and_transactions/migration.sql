/*
  Warnings:

  - You are about to drop the column `identity_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Rooms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `property_id` to the `Room_Types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_rooms` to the `Room_Types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "final_project"."Rooms" DROP CONSTRAINT "Rooms_property_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Rooms" DROP CONSTRAINT "Rooms_type_id_fkey";

-- AlterTable
ALTER TABLE "final_project"."Room_Types" ADD COLUMN     "property_id" TEXT NOT NULL,
ADD COLUMN     "total_rooms" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "final_project"."Users" DROP COLUMN "identity_id",
ADD COLUMN     "is_external_login" BOOLEAN DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "final_project"."Rooms";

-- AddForeignKey
ALTER TABLE "final_project"."Room_Types" ADD CONSTRAINT "Room_Types_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
