-- DropForeignKey
ALTER TABLE "DailyMoodSummary" DROP CONSTRAINT "DailyMoodSummary_userId_fkey";

-- AddForeignKey
ALTER TABLE "DailyMoodSummary" ADD CONSTRAINT "DailyMoodSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
