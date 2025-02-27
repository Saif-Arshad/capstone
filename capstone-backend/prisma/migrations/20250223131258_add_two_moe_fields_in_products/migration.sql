-- AlterTable
ALTER TABLE `products` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'universal',
    ADD COLUMN `createdBy` VARCHAR(191) NULL DEFAULT '';
