-- DropForeignKey
ALTER TABLE `tm_room_facilities` DROP FOREIGN KEY `tm_room_facilities_facility_id_fkey`;

-- DropForeignKey
ALTER TABLE `tm_room_facilities` DROP FOREIGN KEY `tm_room_facilities_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `tm_room_person_in_charges` DROP FOREIGN KEY `tm_room_person_in_charges_person_in_charge_id_fkey`;

-- DropForeignKey
ALTER TABLE `tm_room_person_in_charges` DROP FOREIGN KEY `tm_room_person_in_charges_room_id_fkey`;

-- DropIndex
DROP INDEX `tm_room_facilities_facility_id_fkey` ON `tm_room_facilities`;

-- DropIndex
DROP INDEX `tm_room_facilities_room_id_fkey` ON `tm_room_facilities`;

-- DropIndex
DROP INDEX `tm_room_person_in_charges_person_in_charge_id_fkey` ON `tm_room_person_in_charges`;

-- DropIndex
DROP INDEX `tm_room_person_in_charges_room_id_fkey` ON `tm_room_person_in_charges`;

-- AddForeignKey
ALTER TABLE `tm_room_facilities` ADD CONSTRAINT `tm_room_facilities_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `tm_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_room_facilities` ADD CONSTRAINT `tm_room_facilities_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `tm_facilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_room_person_in_charges` ADD CONSTRAINT `tm_room_person_in_charges_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `tm_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_room_person_in_charges` ADD CONSTRAINT `tm_room_person_in_charges_person_in_charge_id_fkey` FOREIGN KEY (`person_in_charge_id`) REFERENCES `tm_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
