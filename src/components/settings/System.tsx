"use client";

import {useState, useEffect} from "react";
import "./style.css";
import {MdDarkMode, MdLightMode} from "react-icons/md"; // Theme icons

const SystemSettings = () => {
    const [theme, setTheme] = useState<string>("light");
    const [color, setColor] = useState<string>("#007bff");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        const savedColor = localStorage.getItem("appColor") || "#007bff";
        setTheme(savedTheme);
        setColor(savedColor);
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.documentElement.style.setProperty("--primary-color", savedColor);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const changeColor = (newColor: string) => {
        setColor(newColor);
        localStorage.setItem("appColor", newColor);
        document.documentElement.style.setProperty("--primary-color", newColor);
    };

    return (
        <div className="settings-section">
            <h2>Theme</h2>
            <button onClick={toggleTheme}>
                {theme === "light" ? <MdDarkMode size={20}/> : <MdLightMode size={20}/>}
                {theme === "light" ? " Dark Mode" : " Light Mode"}
            </button>

            <h2>App Color</h2>
            <div className="color-picker-container">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => changeColor(e.target.value)}
                />
                <div
                    className="color-preview"
                    style={{backgroundColor: color}}
                ></div>
            </div>
        </div>
    );
};

export default SystemSettings;
