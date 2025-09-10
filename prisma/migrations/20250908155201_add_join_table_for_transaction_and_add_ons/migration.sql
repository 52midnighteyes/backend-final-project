-- CreateTable
CREATE TABLE "final_project"."Transaction_AddOns" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "add_on_id" TEXT NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_AddOns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_AddOns_transaction_id_add_on_id_key" ON "final_project"."Transaction_AddOns"("transaction_id", "add_on_id");

-- AddForeignKey
ALTER TABLE "final_project"."Transaction_AddOns" ADD CONSTRAINT "Transaction_AddOns_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "final_project"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Transaction_AddOns" ADD CONSTRAINT "Transaction_AddOns_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "final_project"."Add_Ons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
