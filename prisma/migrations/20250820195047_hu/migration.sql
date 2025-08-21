/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- DropTable
DROP TABLE "public"."Contact";

-- DropTable
DROP TABLE "public"."User";
