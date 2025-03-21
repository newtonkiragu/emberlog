/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `DailyMoodSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyMoodSummary_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyMoodSummary_userId_date_key" ON "DailyMoodSummary"("userId", "date");
