/*
  Warnings:

  - You are about to drop the column `earnings` on the `Profile` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `platform` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `duration` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('STREAMER', 'CREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('MUSIC', 'VIDEO', 'PODCAST');

-- CreateEnum
CREATE TYPE "public"."PlatformType" AS ENUM ('YOUTUBE', 'SPOTIFY', 'SOUNDCLOUD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('CONTENT_PROMOTION', 'WITHDRAWAL', 'REFUND', 'BONUS');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."WithdrawalMethod" AS ENUM ('BANK_TRANSFER', 'PAYPAL', 'CRYPTO', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Content" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTopListed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "planId" TEXT,
ADD COLUMN     "platform" "public"."PlatformType" NOT NULL,
ADD COLUMN     "pointsAwarded" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."ContentType" NOT NULL,
ALTER COLUMN "duration" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "earnings",
ADD COLUMN     "availableCash" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'STREAMER';

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "contentId" TEXT,
    "planId" TEXT,
    "paymentId" TEXT,
    "metadata" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentView" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Withdrawal" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "public"."WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "method" "public"."WithdrawalMethod" NOT NULL,
    "accountInfo" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentView_contentId_userId_key" ON "public"."ContentView"("contentId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Content" ADD CONSTRAINT "Content_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentView" ADD CONSTRAINT "ContentView_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentView" ADD CONSTRAINT "ContentView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
