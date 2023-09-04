/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `google_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "google_profiles_user_id_key" ON "google_profiles"("user_id");
