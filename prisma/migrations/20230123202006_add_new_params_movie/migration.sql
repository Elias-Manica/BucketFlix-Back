/*
  Warnings:

  - Added the required column `original_title` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overview` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poster_path` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "original_title" TEXT NOT NULL,
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "popularity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "poster_path" TEXT NOT NULL,
ADD COLUMN     "release_date" TEXT NOT NULL,
ADD COLUMN     "tagline" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
