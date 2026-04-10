-- CreateTable
CREATE TABLE `tm_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tm_rooms` ADD CONSTRAINT `tm_rooms_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `tm_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
