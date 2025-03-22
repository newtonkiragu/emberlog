import type {Metadata} from "next";
import "./globals.css";
import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import ThemeProvider from "@/components/themeProvider/ThemeProvider";


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
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </ClientSessionWrapper>
        </body>
        </html>
    );
}
