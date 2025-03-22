import {NextResponse} from "next/server";
import prisma from "@/util/prisma/prisma";
import {getServerSession} from "@/util/auth/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({error: "Unauthorized", status: 401});

        const {entryId} = await req.json();
        const userId = session.user.id;

        const entry = await prisma.entry.findUnique({where: {id: entryId, authorId: userId}});
        if (!entry) return NextResponse.json({error: "Entry not found", status: 404});

        const updatedEntry = await prisma.entry.update({
            where: {id: entryId},
            data: {bookmarked: !entry.bookmarked},
        });

        return NextResponse.json({bookmarked: updatedEntry.bookmarked});

    } catch (error) {
        console.error("Error updating bookmark:", error);
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}
