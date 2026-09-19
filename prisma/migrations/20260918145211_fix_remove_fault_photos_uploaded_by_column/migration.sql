/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `FaultPhoto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FaultPhoto" DROP CONSTRAINT "FaultPhoto_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "FaultPhoto" DROP COLUMN "uploadedBy";
