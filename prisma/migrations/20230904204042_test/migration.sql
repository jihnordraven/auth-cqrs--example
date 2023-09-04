-- DropForeignKey
ALTER TABLE "google_profiles" DROP CONSTRAINT "google_profiles_user_id_fkey";

-- AddForeignKey
ALTER TABLE "google_profiles" ADD CONSTRAINT "google_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
