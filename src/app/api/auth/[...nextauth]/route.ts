import NextAuth from "next-auth";
import {authOptions} from "@/util/auth/auth";

const handler = NextAuth({
    ...authOptions,
    session: {
        ...authOptions.session,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
});

export {handler as GET, handler as POST};