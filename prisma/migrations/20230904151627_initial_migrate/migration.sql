-- CreateEnum
CREATE TYPE "RolesEnum" AS ENUM ('USER', 'ADMIN', 'DEVELOPER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash_password" TEXT NOT NULL,
    "role_name" "RolesEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "google_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "github_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" "RolesEnum" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "password_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_id_key" ON "tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "google_profiles_id_key" ON "google_profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "google_profiles_user_id_key" ON "google_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_profiles_id_key" ON "github_profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "github_profiles_user_id_key" ON "github_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_key" ON "roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "email_codes_id_key" ON "email_codes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "email_codes_code_key" ON "email_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "password_codes_id_key" ON "password_codes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "password_codes_code_key" ON "password_codes"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "roles"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_profiles" ADD CONSTRAINT "google_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_profiles" ADD CONSTRAINT "github_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_codes" ADD CONSTRAINT "email_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_codes" ADD CONSTRAINT "password_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
