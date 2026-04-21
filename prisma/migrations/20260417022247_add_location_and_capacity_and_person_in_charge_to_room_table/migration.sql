/*
  Warnings:

  - Added the required column `capacity` to the `tm_rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `tm_rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tm_rooms` ADD COLUMN `capacity` INTEGER NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `tm_room_person_in_charges` (
    `id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `person_in_charge_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tm_room_person_in_charges` ADD CONSTRAINT `tm_room_person_in_charges_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `tm_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_room_person_in_charges` ADD CONSTRAINT `tm_room_person_in_charges_person_in_charge_id_fkey` FOREIGN KEY (`person_in_charge_id`) REFERENCES `tm_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
