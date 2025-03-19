import {getServerSession as nextAuthGetServerSession, type NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import prisma from "@/util/prisma/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "your@email.com"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: {email: credentials.email},
                });

                if (!user) {
                    throw new Error("No user found");
                }

                const isValidPassword = await compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    session: {strategy: "jwt"},
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({session, token}) {
            if (token?.sub) {
                session.user.id = token.sub; // Attach user ID to the session
            }
            return session;
        },
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};

export const getServerSession = () => nextAuthGetServerSession(authOptions as any);