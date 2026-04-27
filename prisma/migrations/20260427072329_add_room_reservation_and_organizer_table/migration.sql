-- CreateTable
CREATE TABLE `tx_organizers` (
    `id` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NULL,
    `division` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tx_organizers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tx_room_reservations` (
    `id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `reserved_by_id` VARCHAR(191) NOT NULL,
    `organizer_id` VARCHAR(191) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `agenda` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tx_room_reservations` ADD CONSTRAINT `tx_room_reservations_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `tm_rooms`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tx_room_reservations` ADD CONSTRAINT `tx_room_reservations_reserved_by_id_fkey` FOREIGN KEY (`reserved_by_id`) REFERENCES `tm_users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tx_room_reservations` ADD CONSTRAINT `tx_room_reservations_organizer_id_fkey` FOREIGN KEY (`organizer_id`) REFERENCES `tx_organizers`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
