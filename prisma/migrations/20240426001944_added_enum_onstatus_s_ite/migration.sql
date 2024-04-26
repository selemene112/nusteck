/*
  Warnings:

  - The `status` column on the `Site` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Close', 'On_Progress', 'Open');

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "status",
ADD COLUMN     "status" "Role" NOT NULL DEFAULT 'Close';
