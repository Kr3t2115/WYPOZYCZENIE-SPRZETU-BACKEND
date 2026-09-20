/*
  Warnings:

  - A unique constraint covering the columns `[uploadToken]` on the table `Fault` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uploadToken]` on the table `RentalInspection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Fault" ADD COLUMN     "uploadToken" TEXT,
ADD COLUMN     "uploadTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RentalInspection" ADD COLUMN     "uploadToken" TEXT,
ADD COLUMN     "uploadTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Fault_uploadToken_key" ON "Fault"("uploadToken");

-- CreateIndex
CREATE UNIQUE INDEX "RentalInspection_uploadToken_key" ON "RentalInspection"("uploadToken");
