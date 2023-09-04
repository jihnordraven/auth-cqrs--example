/*
  Warnings:

  - You are about to drop the column `is_email_confirmed` on the `users` table. All the data in the column will be lost.
  - Added the required column `email_status_enum` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmailStatusEnum" AS ENUM ('PENDING', 'CONFIRMED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_email_confirmed",
ADD COLUMN     "email_status_enum" "EmailStatusEnum" NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_statuses" (
    "id" SERIAL NOT NULL,
    "name" "EmailStatusEnum" NOT NULL,

    CONSTRAINT "email_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_statuses_id_key" ON "email_statuses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "email_statuses_name_key" ON "email_statuses"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_email_status_enum_fkey" FOREIGN KEY ("email_status_enum") REFERENCES "email_statuses"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
