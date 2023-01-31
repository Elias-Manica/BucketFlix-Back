/*
  Warnings:

  - You are about to drop the column `movieid` on the `following` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `following` table. All the data in the column will be lost.
  - Added the required column `userFollowed` to the `following` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_movieid_fkey";

-- AlterTable
ALTER TABLE "following" DROP COLUMN "movieid",
DROP COLUMN "rating",
ADD COLUMN     "userFollowed" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_userFollowed_fkey" FOREIGN KEY ("userFollowed") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
