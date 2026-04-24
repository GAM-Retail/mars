/*
  Warnings:

  - Added the required column `role` to the `tm_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tm_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tm_users` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role` ENUM('SUPERADMIN', 'ADMIN') NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
