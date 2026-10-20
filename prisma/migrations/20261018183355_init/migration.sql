-- CreateTable
CREATE TABLE `pacientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(150) NOT NULL,
    `documento_identificacion` VARCHAR(30) NOT NULL,
    `correo` VARCHAR(120) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pacientes_documento_identificacion_key`(`documento_identificacion`),
    UNIQUE INDEX `pacientes_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(150) NOT NULL,
    `especialidad` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(120) NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `medicos_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER NOT NULL,
    `medico_id` INTEGER NOT NULL,
    `fecha_hora` DATETIME(3) NOT NULL,
    `motivo` VARCHAR(255) NOT NULL,
    `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `citas_medico_id_fecha_hora_idx`(`medico_id`, `fecha_hora`),
    INDEX `citas_paciente_id_idx`(`paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_medico_id_fkey` FOREIGN KEY (`medico_id`) REFERENCES `medicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
