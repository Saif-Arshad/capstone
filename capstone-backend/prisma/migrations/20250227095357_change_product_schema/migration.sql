/*
  Warnings:

  - Added the required column `availableColor` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableSizes` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `EmbedLink` VARCHAR(191) NULL,
    ADD COLUMN `availableColor` JSON NOT NULL,
    ADD COLUMN `availableSizes` JSON NOT NULL;
