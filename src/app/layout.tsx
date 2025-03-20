import type {Metadata} from "next";
import "./globals.css";


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
        {children}
        </body>
        </html>
    );
}
