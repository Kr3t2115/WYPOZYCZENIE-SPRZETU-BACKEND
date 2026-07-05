/*
  Warnings:

  - You are about to drop the `EquipmentCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentFault` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryAttribute" DROP CONSTRAINT "CategoryAttribute_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentFault" DROP CONSTRAINT "EquipmentFault_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentFault" DROP CONSTRAINT "EquipmentFault_rentalId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentFault" DROP CONSTRAINT "EquipmentFault_reportedBy_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentFault" DROP CONSTRAINT "EquipmentFault_resolvedBy_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentValue" DROP CONSTRAINT "EquipmentValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentValue" DROP CONSTRAINT "EquipmentValue_attributeOptionId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentValue" DROP CONSTRAINT "EquipmentValue_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "FaultPhoto" DROP CONSTRAINT "FaultPhoto_faultId_fkey";

-- AlterTable
ALTER TABLE "CategoryAttribute" ALTER COLUMN "required" SET DEFAULT true;

-- DropTable
DROP TABLE "EquipmentCategory";

-- DropTable
DROP TABLE "EquipmentFault";

-- DropTable
DROP TABLE "EquipmentValue";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentAttribute" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" VARCHAR(255),
    "attributeOptionId" TEXT,

    CONSTRAINT "EquipmentAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fault" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "FaultSeverity" NOT NULL DEFAULT 'MINOR',
    "status" "FaultStatus" NOT NULL DEFAULT 'OPEN',
    "occurredDuring" "OccurrenceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolveNote" TEXT,

    CONSTRAINT "Fault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentAttribute_equipmentId_attributeId_key" ON "EquipmentAttribute"("equipmentId", "attributeId");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAttribute" ADD CONSTRAINT "CategoryAttribute_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAttribute" ADD CONSTRAINT "EquipmentAttribute_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAttribute" ADD CONSTRAINT "EquipmentAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAttribute" ADD CONSTRAINT "EquipmentAttribute_attributeOptionId_fkey" FOREIGN KEY ("attributeOptionId") REFERENCES "AttributeOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaultPhoto" ADD CONSTRAINT "FaultPhoto_faultId_fkey" FOREIGN KEY ("faultId") REFERENCES "Fault"("id") ON DELETE CASCADE ON UPDATE CASCADE;
