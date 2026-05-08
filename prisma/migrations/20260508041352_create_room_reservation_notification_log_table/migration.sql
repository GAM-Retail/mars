/*
  Warnings:

  - You are about to alter the column `action` on the `tx_room_reservation_logs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `tx_room_reservation_logs` MODIFY `action` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL;

-- CreateTable
CREATE TABLE `tx_room_reservation_notification_logs` (
    `id` VARCHAR(191) NOT NULL,
    `reservation_id` VARCHAR(191) NOT NULL,
    `reservationLogId` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` ENUM('SUCCESS', 'FAILED', 'SKIPPED') NOT NULL,
    `error` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `sent_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tx_room_reservation_notification_logs` ADD CONSTRAINT `tx_room_reservation_notification_logs_reservationLogId_fkey` FOREIGN KEY (`reservationLogId`) REFERENCES `tx_room_reservation_logs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
