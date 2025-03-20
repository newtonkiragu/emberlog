import {NextResponse} from "next/server";
import prisma from "@/util/prisma/prisma";
import {getServerSession} from "@/util/auth/auth";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({error: "Unauthorized", status: 401});

        const entry = await prisma.entry.findUnique({
            where: {id: params.id, authorId: session.user.id},
        });

        if (!entry) {
            return NextResponse.json({error: "Entry not found", status: 404});
        }

        return NextResponse.json(entry);
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({error: "Unauthorized", status: 401});

        const {title, content, tags} = await req.json();
        if (!title || !content) {
            return NextResponse.json({error: "Title and content are required", status: 400});
        }

        // Convert tag names to tag objects
        const savedTags = await Promise.all(
            tags.map(async (tagName: string) => {
                return await prisma.tag.upsert({
                    where: {name: tagName},
                    update: {},
                    create: {name: tagName},
                });
            })
        );

        const updatedEntry = await prisma.entry.update({
            where: {id: params.id, authorId: session.user.id},
            data: {
                title,
                content,
                tags: {set: [], connect: savedTags.map((tag) => ({id: tag.id}))}, // Remove old tags and add new ones
            },
        });

        return NextResponse.json(updatedEntry);
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}


export async function DELETE(req: Request, {params}: { params: { id: string } }) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({error: "Unauthorized", status: 401});

        const entry = await prisma.entry.findUnique({
            where: {id: params.id, authorId: session.user.id},
        });

        if (!entry) {
            return NextResponse.json({error: "Entry not found", status: 404});
        }

        await prisma.entry.delete({
            where: {id: params.id, authorId: session.user.id},
        });

        return NextResponse.json({message: "Entry deleted successfully", status: 200});
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}
