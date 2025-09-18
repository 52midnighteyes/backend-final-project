/*
  Warnings:

  - A unique constraint covering the columns `[province_id,name]` on the table `Cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[country_id,name]` on the table `Provinces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cities_province_id_name_key" ON "final_project"."Cities"("province_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Provinces_country_id_name_key" ON "final_project"."Provinces"("country_id", "name");
