import {NextResponse} from "next/server";
import prisma from "@/util/prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const {name, email, password} = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                {error: "Email and password are required", status: 400}
            );
        }

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json(
                {error: "User already exists", status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {name, email, password: hashedPassword},
        });

        return NextResponse.json(
            {message: "User created", user: {id: user.id, email: user.email}, status: 201}
        );
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            {error: "Internal server error", status: 500}
        );
    }
}