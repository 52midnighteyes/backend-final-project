-- DropForeignKey
ALTER TABLE "final_project"."Temporary_Tokens" DROP CONSTRAINT "Temporary_Tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "final_project"."Temporary_Tokens" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "final_project"."Temporary_Tokens" ADD CONSTRAINT "Temporary_Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
