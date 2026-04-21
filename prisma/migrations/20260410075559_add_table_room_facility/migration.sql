-- CreateTable
CREATE TABLE `tm_room_facilities` (
    `id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `facility_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tm_room_facilities` ADD CONSTRAINT `tm_room_facilities_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `tm_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tm_room_facilities` ADD CONSTRAINT `tm_room_facilities_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `tm_facilities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
