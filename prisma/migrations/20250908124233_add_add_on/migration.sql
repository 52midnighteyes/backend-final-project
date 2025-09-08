-- CreateTable
CREATE TABLE "final_project"."Add_Ons" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Add_Ons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "final_project"."Add_Ons" ADD CONSTRAINT "Add_Ons_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
