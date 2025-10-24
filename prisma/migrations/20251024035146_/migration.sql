/*
  Warnings:

  - You are about to drop the column `isActive` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Student` DROP COLUMN `isActive`,
    ADD COLUMN `isSuspended` BOOLEAN NOT NULL DEFAULT false;
