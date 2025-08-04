/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[];
