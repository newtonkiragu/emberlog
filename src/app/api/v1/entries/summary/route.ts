import {NextRequest, NextResponse} from "next/server";
import prisma from "@/util/prisma/prisma";
import {getServerSession} from "@/util/auth/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized", status: 401});
        }

        const userId = session.user.id;

        // Fetch all entries for the user
        const entries = await prisma.entry.findMany({
            where: {authorId: userId},
            include: {tags: true},
        });

        // Compute summary metrics
        const totalEntries = entries.length;
        const avgWordCount = totalEntries > 0
            ? entries.reduce((acc, entry) => acc + entry.content.split(" ").length, 0) / totalEntries
            : 0;

        // Compute most used tags
        const tagCounts: Record<string, number> = {};
        entries.forEach(entry => {
            entry.tags.forEach(tag => {
                tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
            });
        });

        const mostUsedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag, count]) => ({tag, count}));

        // Compute mood trends
        const moodSummaries = await prisma.dailyMoodSummary.findMany({
            where: {userId},
            orderBy: {date: "asc" as const}, // Fix type issue
        });

        const moodTrends = moodSummaries.map(summary => ({
            date: summary.date.toISOString().split("T")[0],
            mood: summary.mood,
        }));

        // Compute entry frequency (heatmap data)
        const entryFrequency: Record<string, number> = {};
        entries.forEach(entry => {
            const date = entry.createdAt.toISOString().split("T")[0];
            entryFrequency[date] = (entryFrequency[date] || 0) + 1;
        });

        // Save summary to the database
        await prisma.entrySummary.upsert({
            where: {userId},
            update: {
                totalEntries,
                avgWordCount,
                mostUsedTags: JSON.stringify(mostUsedTags), // Convert to JSON
                moodTrends: JSON.stringify(moodTrends), // Convert to JSON
                entryFrequency: JSON.stringify(entryFrequency), // Convert to JSON
            },
            create: {
                userId,
                totalEntries,
                avgWordCount,
                mostUsedTags: JSON.stringify(mostUsedTags), // Convert to JSON
                moodTrends: JSON.stringify(moodTrends), // Convert to JSON
                entryFrequency: JSON.stringify(entryFrequency), // Convert to JSON
            },
        });

        return NextResponse.json({
            totalEntries,
            avgWordCount,
            mostUsedTags,
            moodTrends,
            entryFrequency,
        });
    } catch (error) {
        console.error("Error generating summary:", error);
        return NextResponse.json({error: "Failed to generate summary", status: 500});
    }
}
