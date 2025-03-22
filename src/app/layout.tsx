import type {Metadata} from "next";
import "./globals.css";
import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";


export const metadata: Metadata = {
    title: "EmberLog",
    description: "Your personal journal infused with AI",
};

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
        <body>
        <ClientSessionWrapper>
            {children}
        </ClientSessionWrapper>
        </body>
        </html>
    );
}
