/*
  Warnings:

  - Added the required column `name` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "publicUrl" DROP NOT NULL;
