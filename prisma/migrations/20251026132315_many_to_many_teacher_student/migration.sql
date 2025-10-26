-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_teacherId_fkey`;

-- DropIndex
DROP INDEX `Student_teacherId_fkey` ON `Student`;

-- CreateTable
CREATE TABLE `_TeacherStudents` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TeacherStudents_AB_unique`(`A`, `B`),
    INDEX `_TeacherStudents_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TeacherStudents` ADD CONSTRAINT `_TeacherStudents_A_fkey` FOREIGN KEY (`A`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TeacherStudents` ADD CONSTRAINT `_TeacherStudents_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
