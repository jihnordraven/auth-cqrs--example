-- AlterTable
ALTER TABLE "google_profiles" ALTER COLUMN "display_name" DROP NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
