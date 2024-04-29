/*
  Warnings:

  - You are about to drop the `KontakPic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `namapic` to the `LocationSite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notelp` to the `LocationSite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "KontakPic" DROP CONSTRAINT "KontakPic_id_site_fkey";

-- AlterTable
ALTER TABLE "LocationSite" ADD COLUMN     "namapic" TEXT NOT NULL,
ADD COLUMN     "notelp" TEXT NOT NULL;

-- DropTable
DROP TABLE "KontakPic";
