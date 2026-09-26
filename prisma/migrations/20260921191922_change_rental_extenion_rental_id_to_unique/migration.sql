/*
  Warnings:

  - A unique constraint covering the columns `[rentalId]` on the table `RentalExtension` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RentalExtension_rentalId_key" ON "RentalExtension"("rentalId");
