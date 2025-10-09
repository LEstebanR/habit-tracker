-- AlterTable
ALTER TABLE "public"."Habit" ADD COLUMN     "xpReward" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "updatedAt" DROP DEFAULT;
