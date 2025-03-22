-- CreateTable
CREATE TABLE "EntrySummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalEntries" INTEGER NOT NULL DEFAULT 0,
    "avgWordCount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mostUsedTags" JSONB NOT NULL,
    "moodTrends" JSONB NOT NULL,
    "entryFrequency" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntrySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntrySummary_userId_key" ON "EntrySummary"("userId");

-- AddForeignKey
ALTER TABLE "EntrySummary" ADD CONSTRAINT "EntrySummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
