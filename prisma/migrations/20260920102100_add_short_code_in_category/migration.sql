/*
  Warnings:

  - Added the required column `shortCode` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "shortCode" VARCHAR(5) NOT NULL;
