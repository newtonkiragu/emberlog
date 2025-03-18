-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "tagIds" TEXT[];

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "entriesId" TEXT[];
