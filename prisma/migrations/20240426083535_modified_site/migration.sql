/*
  Warnings:

  - You are about to drop the column `kota` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `namapic` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `notelp` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `Site` table. All the data in the column will be lost.
  - The `durasi` column on the `Site` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[siteid]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kabupaten` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteid` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "kota",
DROP COLUMN "location",
DROP COLUMN "namapic",
DROP COLUMN "notelp",
DROP COLUMN "remark",
ADD COLUMN     "kabupaten" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "siteid" TEXT NOT NULL,
DROP COLUMN "durasi",
ADD COLUMN     "durasi" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "KontakPic" (
    "id" TEXT NOT NULL,
    "id_site" TEXT NOT NULL,
    "namapic" TEXT NOT NULL,
    "notelp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KontakPic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Renmark" (
    "id" TEXT NOT NULL,
    "id_site" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "CreatedMarkby" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Renmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KontakPic_id_site_key" ON "KontakPic"("id_site");

-- CreateIndex
CREATE UNIQUE INDEX "Site_siteid_key" ON "Site"("siteid");

-- AddForeignKey
ALTER TABLE "KontakPic" ADD CONSTRAINT "KontakPic_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renmark" ADD CONSTRAINT "Renmark_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
