-- CreateEnum
CREATE TYPE "final_project"."UserRole" AS ENUM ('USER', 'TENANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "final_project"."Transaction_Status" AS ENUM ('WAITING_FOR_PAYMENT', 'WAITING_FOR_CONFIRMATION', 'PAID', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "final_project"."Pricing_type" AS ENUM ('NOMINAL', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "final_project"."Pricing_priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "final_project"."Temporary_Token_Type" AS ENUM ('RESET_PASSWORD', 'RESET_EMAIL', 'FORGOT_PASSWORD');

-- CreateTable
CREATE TABLE "final_project"."User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "final_project"."UserRole" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "login_attempt" INTEGER NOT NULL DEFAULT 0,
    "login_time_out" TIMESTAMP(3),
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspended_cooldown" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Property_Picture" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "Property_Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Reservation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "is_checkin" BOOLEAN NOT NULL DEFAULT false,
    "is_checkout" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Transaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_proof" TEXT,
    "status" "final_project"."Transaction_Status" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Pricing" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "type" "final_project"."Pricing_type" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "priority_level" "final_project"."Pricing_priority" NOT NULL,
    "is_rentable" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Review" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Reply" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "base_price" INTEGER NOT NULL,
    "type_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "size" DECIMAL(65,30) NOT NULL,
    "bed_type_id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Bed_Type" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Bed_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Room_Type" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Room_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_project"."Temporary_Token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "type" "final_project"."Temporary_Token_Type" NOT NULL,

    CONSTRAINT "Temporary_Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "final_project"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "final_project"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_id_key" ON "final_project"."Property"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "final_project"."Property"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Property_Picture_url_key" ON "final_project"."Property_Picture"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_id_key" ON "final_project"."Reservation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_transaction_id_key" ON "final_project"."Reservation"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "final_project"."Transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reservation_id_key" ON "final_project"."Review"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_id_key" ON "final_project"."Room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_Type_id_key" ON "final_project"."Room_Type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "final_project"."Category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "final_project"."Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Temporary_Token_token_key" ON "final_project"."Temporary_Token"("token");

-- AddForeignKey
ALTER TABLE "final_project"."Property" ADD CONSTRAINT "Property_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "final_project"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Property" ADD CONSTRAINT "Property_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "final_project"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Property_Picture" ADD CONSTRAINT "Property_Picture_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reservation" ADD CONSTRAINT "Reservation_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "final_project"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Transaction" ADD CONSTRAINT "Transaction_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "final_project"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Pricing" ADD CONSTRAINT "Pricing_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Review" ADD CONSTRAINT "Review_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "final_project"."Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reply" ADD CONSTRAINT "Reply_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Reply" ADD CONSTRAINT "Reply_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "final_project"."Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room" ADD CONSTRAINT "Room_bed_type_id_fkey" FOREIGN KEY ("bed_type_id") REFERENCES "final_project"."Bed_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room" ADD CONSTRAINT "Room_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "final_project"."Room_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room" ADD CONSTRAINT "Room_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Bed_Type" ADD CONSTRAINT "Bed_Type_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Room_Type" ADD CONSTRAINT "Room_Type_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "final_project"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Province" ADD CONSTRAINT "Province_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "final_project"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."City" ADD CONSTRAINT "City_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "final_project"."Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_project"."Temporary_Token" ADD CONSTRAINT "Temporary_Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "final_project"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
