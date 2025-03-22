"use client";

import {useState, useEffect} from "react";

const ThemeProvider = ({children}: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>("light");
    const [color, setColor] = useState<string>("#007bff");

    useEffect(() => {
        // Get theme and color from localStorage
        const savedTheme = localStorage.getItem("theme") || "light";
        const savedColor = localStorage.getItem("appColor") || "#007bff";

        // Apply theme and color globally
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.documentElement.style.setProperty("--primary-color", savedColor);

        setTheme(savedTheme);
        setColor(savedColor);
    }, []);

    return <>{children}</>;
};

export default ThemeProvider;
