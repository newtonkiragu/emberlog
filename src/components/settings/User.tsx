"use client";

import {useState} from "react";
import "./style.css";
import {updateUserName, updateUserPassword} from "@/util/api/settings";

const UserSettings = () => {
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNameChange = async () => {
        setLoading(true);
        const response = await updateUserName(name);
        setMessage(response.message || response.error);
        setLoading(false);
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        const response = await updateUserPassword(currentPassword, newPassword);
        setMessage(response.message || response.error);
        setLoading(false);
    };

    return (
        <div className="settings-section">
            <h2>Update Name</h2>
            <input
                type="text"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleNameChange} disabled={loading}>
                {loading ? "Saving..." : "Save Name"}
            </button>

            <h2>Change Password</h2>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange} disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
            </button>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UserSettings;
