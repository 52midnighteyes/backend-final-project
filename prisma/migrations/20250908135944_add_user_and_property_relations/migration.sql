/*
  Warnings:

  - Added the required column `user_id` to the `Properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "final_project"."Properties" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "final_project"."Properties" ADD CONSTRAINT "Properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
