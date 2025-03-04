/*
  Warnings:

  - Added the required column `imageType` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('PROFILE_PICTURE', 'BANNER', 'POST_IMAGE');

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "imageType" "ImageType" NOT NULL;
