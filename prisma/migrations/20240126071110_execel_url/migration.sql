/*
  Warnings:

  - Added the required column `key` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicUrl` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "publicUrl" TEXT NOT NULL;
