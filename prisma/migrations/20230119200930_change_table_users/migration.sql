/*
  Warnings:

  - Added the required column `pictureUrl` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pictureUrl" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
