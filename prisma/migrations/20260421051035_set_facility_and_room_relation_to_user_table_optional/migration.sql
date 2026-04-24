-- DropForeignKey
ALTER TABLE `tm_facilities` DROP FOREIGN KEY `tm_facilities_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `tm_rooms` DROP FOREIGN KEY `tm_rooms_created_by_fkey`;

-- DropIndex
DROP INDEX `tm_facilities_created_by_fkey` ON `tm_facilities`;

-- DropIndex
DROP INDEX `tm_rooms_created_by_fkey` ON `tm_rooms`;

-- AlterTable
ALTER TABLE `tm_facilities` MODIFY `created_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tm_rooms` MODIFY `created_by` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `tm_facilities` ADD CONSTRAINT `tm_facilities_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `tm_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_rooms` ADD CONSTRAINT `tm_rooms_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `tm_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
