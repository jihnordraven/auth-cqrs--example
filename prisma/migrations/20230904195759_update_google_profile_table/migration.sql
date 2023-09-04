/*
  Warnings:

  - A unique constraint covering the columns `[provider_id]` on the table `google_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `google_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `google_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_name` to the `google_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `google_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `google_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `google_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `google_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `google_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "google_profiles" ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "provider_id" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "google_profiles_provider_id_key" ON "google_profiles"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "google_profiles_username_key" ON "google_profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "google_profiles_email_key" ON "google_profiles"("email");
