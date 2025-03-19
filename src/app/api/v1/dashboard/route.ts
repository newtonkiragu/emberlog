import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "@/util/auth/auth";
import prisma from "@/util/prisma/prisma";
import {format} from "date-fns";

export async function GET(req: NextRequest) {
    const session = await getServerSession();

    if (!session || !session.user) {
        return NextResponse.json({error: "Unauthorized", status: 401});
    }

    const {searchParams} = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
        return NextResponse.json({error: "Date is required", status: 400});
    }

    const userId = session.user.id;
    const selectedDate = new Date(dateParam);

    try {
        // Fetch entries
        const entries = await prisma.entry.findMany({
            where: {
                authorId: userId,
                createdAt: {
                    gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                    lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
                },
            },
            include: {tags: true},
            orderBy: {createdAt: "desc"},
        });

        // Fetch mood summary
        const moodSummary = await prisma.dailyMoodSummary.findUnique({
            where: {
                date: new Date(format(selectedDate, "yyyy-MM-dd")),
                userId,
            },
        });

        // Fetch most used tags
        const tags = await prisma.tag.findMany({
            where: {
                entries: {
                    some: {authorId: userId},
                },
            },
            orderBy: {score: "desc"},
            take: 5,
        });

        return NextResponse.json({
            entries,
            moodAnalysis: moodSummary?.mood || null,
            tags: tags.map((tag) => tag.name),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Internal server error", status: 500});
    }
}
