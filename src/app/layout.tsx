import type {Metadata} from "next";
import "./globals.css";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import theme from "@/util/theme/theme";
import {CssBaseline} from "@mui/material";

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
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>

        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
