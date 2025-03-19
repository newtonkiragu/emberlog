import {NextResponse} from "next/server";
import prisma from "@/util/prisma/prisma";
import {autoTagEntry} from "@/util/huggingface/autoTagEntry";
import {analyzeSentiment} from "@/util/huggingface/analyzeSentiment";
import {getServerSession} from "@/util/auth/auth";

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

        // Update or create daily mood summary
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.dailyMoodSummary.upsert({
            where: {userId: userId, date: today},
            update: {mood},
            create: {date: new Date(), mood, userId},
        });

        return NextResponse.json({entry, status: 201});

    } catch (error) {
        console.error("Error saving entry:", error);
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}
