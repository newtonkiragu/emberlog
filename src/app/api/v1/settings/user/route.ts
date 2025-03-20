import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { name } = req.body;
    if (!name || name.length < 3) {
        return res.status(400).json({ error: "Invalid name" });
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name },
        });

        return res.status(200).json({ message: "Name updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update name" });
    }
}
