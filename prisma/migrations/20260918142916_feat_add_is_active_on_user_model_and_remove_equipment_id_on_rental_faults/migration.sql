/*
  Warnings:

  - You are about to drop the column `equipmentId` on the `Fault` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fault" DROP CONSTRAINT "Fault_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Fault" DROP COLUMN "equipmentId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
