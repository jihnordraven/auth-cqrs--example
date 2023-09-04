-- AlterTable
ALTER TABLE "email_codes" ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "password_codes" ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;
