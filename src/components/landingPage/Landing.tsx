"use client";

import Image from "next/image";
import "./style.css";

const features = [
    {icon: "✏️", text: "Write down your thoughts/happenings each day."},
    {icon: "☁️", text: "Cloud syncing across devices."},
    {icon: "😊", text: "Mood tracking statistics."},
    {icon: "🔥", text: "Streaks to keep you in the habit of writing."},
    {icon: "🌙", text: "Dark mode, because you deserve it."},
    {icon: "🎨", text: "App color customization."},
];

const Landing = () => {
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to Emberlog</h1>
                <p>Your personal journaling app.</p>
                <button className="cta-btn" aria-label="Get Started">
                    Get Started
                </button>
            </section>

            {/* Introduction Section */}
            <section className="intro">
                <h2>The better way to keep track of your days.</h2>
                <p>
                    Emberlog lets you record your daily thoughts and moods beautifully.
                    Stay in touch with your personal growth and relive your best memories!
                </p>
                <Image
                    src="/images/hero.svg"
                    alt="Hero illustration"
                    width={500}
                    height={300}
                    priority
                />
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Features</h2>
                <div className="feature-grid">
                    {features.map(({icon, text}, index) => (
                        <div key={index} className="feature-card">
                            <span className="feature-icon">{icon}</span>
                            <p>{text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;
