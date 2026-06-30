/*
  Warnings:

  - You are about to drop the column `department` on the `tm_users` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `tm_users` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `tx_organizers` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `tx_organizers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tm_users` DROP COLUMN `department`,
    DROP COLUMN `division`,
    ADD COLUMN `department_id` VARCHAR(191) NULL,
    ADD COLUMN `division_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tx_organizers` DROP COLUMN `department`,
    DROP COLUMN `division`,
    ADD COLUMN `department_id` VARCHAR(191) NULL,
    ADD COLUMN `division_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `tm_divisions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tm_departments` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tm_organizations` (
    `id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `division_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tm_users` ADD CONSTRAINT `tm_users_division_id_fkey` FOREIGN KEY (`division_id`) REFERENCES `tm_divisions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_users` ADD CONSTRAINT `tm_users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `tm_departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tx_organizers` ADD CONSTRAINT `tx_organizers_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `tm_departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tx_organizers` ADD CONSTRAINT `tx_organizers_division_id_fkey` FOREIGN KEY (`division_id`) REFERENCES `tm_divisions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_organizations` ADD CONSTRAINT `tm_organizations_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `tm_departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_organizations` ADD CONSTRAINT `tm_organizations_division_id_fkey` FOREIGN KEY (`division_id`) REFERENCES `tm_divisions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
