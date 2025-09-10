-- AlterTable
ALTER TABLE "final_project"."Pricings" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "final_project"."Transactions" ALTER COLUMN "special_request" DROP NOT NULL;

-- CreateTable
CREATE TABLE "final_project"."Availability_Daily" (
    "room_type_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total_rooms" INTEGER NOT NULL,
    "held_count" INTEGER NOT NULL DEFAULT 0,
    "booked_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_Daily_pkey" PRIMARY KEY ("room_type_id","date")
);

-- CreateIndex
CREATE INDEX "Availability_Daily_date_idx" ON "final_project"."Availability_Daily"("date");

-- CreateIndex
CREATE INDEX "Transactions_room_type_id_idx" ON "final_project"."Transactions"("room_type_id");

-- CreateIndex
CREATE INDEX "Transactions_status_idx" ON "final_project"."Transactions"("status");

-- CreateIndex
CREATE INDEX "Transactions_expired_at_idx" ON "final_project"."Transactions"("expired_at");

-- CreateIndex
CREATE INDEX "Transactions_start_date_idx" ON "final_project"."Transactions"("start_date");

-- CreateIndex
CREATE INDEX "Transactions_end_date_idx" ON "final_project"."Transactions"("end_date");

-- AddForeignKey
ALTER TABLE "final_project"."Availability_Daily" ADD CONSTRAINT "Availability_Daily_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "final_project"."Room_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
