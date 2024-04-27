/*
  Warnings:

  - You are about to drop the column `desa` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `kabupaten` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatan` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "desa",
DROP COLUMN "kabupaten",
DROP COLUMN "kecamatan",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "provinsi";

-- CreateTable
CREATE TABLE "LocationSite" (
    "id" TEXT NOT NULL,
    "id_site" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationSite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationSite_id_site_key" ON "LocationSite"("id_site");

-- AddForeignKey
ALTER TABLE "LocationSite" ADD CONSTRAINT "LocationSite_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
