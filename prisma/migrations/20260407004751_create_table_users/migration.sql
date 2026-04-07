-- CreateTable
CREATE TABLE `tm_users` (
    `id` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tm_users_nik_key`(`nik`),
    UNIQUE INDEX `tm_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
