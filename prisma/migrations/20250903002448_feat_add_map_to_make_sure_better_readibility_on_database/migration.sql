/*
  Warnings:

  - You are about to drop the `Bed_Type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pricing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Property_Picture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Province` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room_Facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room_Type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Temporary_Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "final_project"."City" DROP CONSTRAINT "City_province_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Pricing" DROP CONSTRAINT "Pricing_room_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Property" DROP CONSTRAINT "Property_category_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Property" DROP CONSTRAINT "Property_city_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Property_Picture" DROP CONSTRAINT "Property_Picture_property_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Province" DROP CONSTRAINT "Province_country_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Reply" DROP CONSTRAINT "Reply_review_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Reply" DROP CONSTRAINT "Reply_user_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Reservation" DROP CONSTRAINT "Reservation_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Reservation" DROP CONSTRAINT "Reservation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Review" DROP CONSTRAINT "Review_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room" DROP CONSTRAINT "Room_property_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room" DROP CONSTRAINT "Room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room_Type" DROP CONSTRAINT "Room_Type_bed_type_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room_Type_Facility" DROP CONSTRAINT "Room_Type_Facility_room_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Room_Type_Facility" DROP CONSTRAINT "Room_Type_Facility_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Temporary_Token" DROP CONSTRAINT "Temporary_Token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Transaction" DROP CONSTRAINT "Transaction_room_id_fkey";

-- DropForeignKey
ALTER TABLE "final_project"."Transaction" DROP CONSTRAINT "Transaction_user_id_fkey";

-- DropTable
DROP TABLE "final_project"."Bed_Type";

-- DropTable
DROP TABLE "final_project"."Category";

-- DropTable
DROP TABLE "final_project"."City";

-- DropTable
DROP TABLE "final_project"."Country";

-- DropTable
DROP TABLE "final_project"."Pricing";

-- DropTable
DROP TABLE "final_project"."Property";

-- DropTable
DROP TABLE "final_project"."Property_Picture";

-- DropTable
DROP TABLE "final_project"."Province";

-- DropTable
DROP TABLE "final_project"."Reply";

-- DropTable
DROP TABLE "final_project"."Reservation";

-- DropTable
DROP TABLE "final_project"."Review";

-- DropTable
DROP TABLE "final_project"."Room";

-- DropTable
DROP TABLE "final_project"."Room_Facility";

-- DropTable
DROP TABLE "final_project"."Room_Type";

-- DropTable
DROP TABLE "final_project"."Temporary_Token";

-- DropTable
DROP TABLE "final_project"."Transaction";

-- DropTable
DROP TABLE "final_project"."User";

-- CreateTable
CREATE TABLE "final_project"."Users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "final_project"."User_Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "login_attempt" INTEGER NOT NULL DEFAULT 0,
    "login_time_out" TIMESTAMP(3),
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspended_cooldown" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Property_Pictures" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "Property_Pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Reservations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "is_checkin" BOOLEAN NOT NULL DEFAULT false,
    "is_checkout" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "notes" TEXT NOT NULL,
    "payment_proof" TEXT,
    "status" "final_project"."Transaction_Status" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3),

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Pricings" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "priority_level" "final_project"."Pricing_priority" NOT NULL,
    "is_rentable" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Reviews" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Replies" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Rooms" (
    "id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "bed_type_id" TEXT NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Bed_Types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Bed_Types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Room_Types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "base_price" INTEGER NOT NULL,
    "size" DECIMAL(65,30) NOT NULL,
    "bed_type_id" TEXT NOT NULL,

    CONSTRAINT "Room_Types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Room_Facilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Room_Facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Provinces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,

    CONSTRAINT "Provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Temporary_Tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "type" "final_project"."Temporary_Token_Type" NOT NULL,

    CONSTRAINT "Temporary_Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "final_project"."Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "final_project"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Properties_id_key" ON "final_project"."Properties"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Properties_slug_key" ON "final_project"."Properties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Property_Pictures_url_key" ON "final_project"."Property_Pictures"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Reservations_id_key" ON "final_project"."Reservations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reservations_transaction_id_key" ON "final_project"."Reservations"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_id_key" ON "final_project"."Transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_reservation_id_key" ON "final_project"."Reviews"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_id_key" ON "final_project"."Rooms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_Types_id_key" ON "final_project"."Room_Types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_id_key" ON "final_project"."Categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Countries_code_key" ON "final_project"."Countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Temporary_Tokens_token_key" ON "final_project"."Temporary_Tokens"("token");

-- AddForeignKey
ALTER TABLE "final_project"."Properties" ADD CONSTRAINT "Properties_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "final_project"."Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Properties" ADD CONSTRAINT "Properties_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "final_project"."Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Property_Pictures" ADD CONSTRAINT "Property_Pictures_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reservations" ADD CONSTRAINT "Reservations_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "final_project"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reservations" ADD CONSTRAINT "Reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Transactions" ADD CONSTRAINT "Transactions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "final_project"."Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Pricings" ADD CONSTRAINT "Pricings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "final_project"."Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reviews" ADD CONSTRAINT "Reviews_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "final_project"."Reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Replies" ADD CONSTRAINT "Replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Replies" ADD CONSTRAINT "Replies_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "final_project"."Reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Rooms" ADD CONSTRAINT "Rooms_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "final_project"."Room_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Rooms" ADD CONSTRAINT "Rooms_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Types" ADD CONSTRAINT "Room_Types_bed_type_id_fkey" FOREIGN KEY ("bed_type_id") REFERENCES "final_project"."Bed_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type_Facility" ADD CONSTRAINT "Room_Type_Facility_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "final_project"."Room_Types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type_Facility" ADD CONSTRAINT "Room_Type_Facility_room_facility_id_fkey" FOREIGN KEY ("room_facility_id") REFERENCES "final_project"."Room_Facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Provinces" ADD CONSTRAINT "Provinces_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "final_project"."Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Cities" ADD CONSTRAINT "Cities_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "final_project"."Provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Temporary_Tokens" ADD CONSTRAINT "Temporary_Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
