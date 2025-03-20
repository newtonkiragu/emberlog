"use client";

import { useState, useEffect } from "react";
import "./style.css";
import UserSettings from "@/components/settings/User";
import SystemSettings from "@/components/settings/System";

const Settings = () => {
    const [activeTab, setActiveTab] = useState<"user" | "system">("user");

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="tabs">
                <button
                    className={activeTab === "user" ? "active" : ""}
                    onClick={() => setActiveTab("user")}
                >
                    User Settings
                </button>
                <button
                    className={activeTab === "system" ? "active" : ""}
                    onClick={() => setActiveTab("system")}
                >
                    System Settings
                </button>
            </div>

            {activeTab === "user" ? <UserSettings /> : <SystemSettings />}
        </div>
    );
};

export default Settings;
