/*
  Warnings:

  - You are about to alter the column `unit` on the `Attribute` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(5)`.
  - A unique constraint covering the columns `[inventoryNumber]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inventoryNumber` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attribute" ALTER COLUMN "unit" SET DATA TYPE VARCHAR(5);

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "inventoryNumber" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_inventoryNumber_key" ON "Equipment"("inventoryNumber");
