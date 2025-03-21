import {NextResponse} from "next/server";
import prisma from "@/util/prisma/prisma";
import {autoTagEntry} from "@/util/huggingface/autoTagEntry";
import {analyzeSentiment} from "@/util/huggingface/analyzeSentiment";
import {getServerSession} from "@/util/auth/auth";
import {Mood} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({error: "Unauthorized", status: 401});

        const {title, content} = await req.json();
        if (!title || !content) {
            return NextResponse.json({error: "Title and content are required", status: 400});
        }

        const userId = session.user.id;
        console.log(userId);

        // Save journal entry first
        const entry = await prisma.entry.create({
            data: {
                title,
                content,
                authorId: userId
            }
        });

        // Perform AI analysis (Sentiment & Tagging)
        console.log("analyzing mood");
        const {mood, score} = await analyzeSentiment({title, content});
        console.log("found mood", mood, score);
        console.log("analyzing tags");
        const savedTags = await autoTagEntry({id: entry.id, title, content, tags: []});

        // Link tags and mood data to the entry
        await prisma.entry.update({
            where: {id: entry.id},
            data: {
                tags: {connect: savedTags.map((tag) => ({id: tag.id}))},
                mood,      // Store the analyzed mood category
                moodScore: score // Store the sentiment score
            },
        });

        // Ensure date is always stored at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize the date to midnight

// Fetch all moods for the day and compute the most common mood
        const entriesForToday = await prisma.entry.findMany({
            where: {
                authorId: userId,
                createdAt: {
                    gte: today, // Entries from today at midnight
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Before midnight tomorrow
                }
            },
            select: {mood: true}
        });

// If no entries exist, default to NEUTRAL
        let computedMood: Mood = Mood.NEUTRAL;

        if (entriesForToday.length > 0) {
            const moodCounts = entriesForToday.reduce((acc, {mood}) => {
                acc[mood] = (acc[mood] || 0) + 1;
                return acc;
            }, {} as Record<Mood, number>);

            // Determine the most frequent mood of the day
            computedMood = Object.keys(moodCounts).reduce((a, b) =>
                moodCounts[a as Mood] > moodCounts[b as Mood] ? (a as Mood) : (b as Mood)
            ) as Mood;
        }

// Update or create daily mood summary
        await prisma.dailyMoodSummary.upsert({
            where: {
                userId,
                date: today
            },
            update: {mood: computedMood},
            create: {userId, date: today, mood: computedMood}
        });


        return NextResponse.json({entry, status: 201});

    } catch (error) {
        console.error("Error saving entry:", error);
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}
