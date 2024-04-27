/*
  Warnings:

  - You are about to drop the column `id_worker` on the `PersonRes` table. All the data in the column will be lost.
  - You are about to drop the column `name_worker` on the `PersonRes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PersonRes" DROP CONSTRAINT "PersonRes_id_worker_fkey";

-- AlterTable
ALTER TABLE "PersonRes" DROP COLUMN "id_worker",
DROP COLUMN "name_worker";
