"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "./dashboard.css";
import {Mood} from "@prisma/client";

interface Tag {
    id: string;
    name: string;
    score: number;
    entriesId: string[];
    createdAt: string;
}

interface Entry {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
    authorId: string;
    tagIds: string[];
    mood: string; // Added mood
    moodScore: number; // Added moodScore
    tags: Tag[];
}

interface DashboardData {
    entries: Entry[];
    moodAnalysis: any | null; // Keep it flexible if you don't know its structure
    tags: string[];
    mood: Mood | null;
}


const moodStyles: Record<Mood, { color: string; icon: string }> = {
    TERRIBLE: {color: "#8B0000", icon: "😡"},
    BAD: {color: "#D32F2F", icon: "😠"},
    SAD: {color: "#1976D2", icon: "😢"},
    MEH: {color: "#808080", icon: "😑"},
    NEUTRAL: {color: "#757575", icon: "😐"},
    OKAY: {color: "#388E3C", icon: "🙂"},
    GOOD: {color: "#2E7D32", icon: "😊"},
    GREAT: {color: "#1B5E20", icon: "😁"},
    HAPPY: {color: "#FFD700", icon: "😃"},
};

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [entries, setEntries] = useState<DashboardData["entries"]>([]);
    const [moodAnalysis, setMoodAnalysis] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [mood, setMood] = useState<Mood | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const router = useRouter();

    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDate) return;
            setLoading(true);
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd", {locale: enUS});
                const response = await fetch(`/api/v1/dashboard?date=${formattedDate}`);
                const data: DashboardData = await response.json();
                if (response.ok) {
                    setEntries(data.entries);
                    setMoodAnalysis(data.moodAnalysis);
                    setTags(data.tags);
                    setMood(data.mood);


                } else {
                    console.error("Error fetching dashboard data:", data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [selectedDate]);

    return (
        <div className="container dashboard-container">
            {/* Date Navigation */}
            <div className="date-navigation">
                <button
                    className="button-outline"
                    onClick={() => setSelectedDate(selectedDate ? new Date(selectedDate.getTime() - 86400000) : new Date())}
                >
                    ←
                </button>
                <h2>{selectedDate ? format(selectedDate, "PPP", {locale: enUS}) : ""}</h2>
                <button
                    className="button-outline"
                    onClick={() => setSelectedDate(selectedDate ? new Date(selectedDate.getTime() + 86400000) : new Date())}
                >
                    →
                </button>
                <button className="button-primary" onClick={() => setSelectedDate(new Date())}>
                    Today
                </button>
            </div>

            {/* Write Button */}
            {selectedDate && format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && (
                <div className="write-entry">
                    <button className="button-primary" onClick={() => router.push("/write-entry")}>
                        Write Something
                    </button>
                </div>
            )}

            {/* Dashboard Data */}
            <div className="dashboard-grid">
                {/* Mood Analysis */}
                <div className="card mood-card" style={{backgroundColor: mood ? moodStyles[mood].color : "#ccc"}}>
                    <h3>
                        Mood Analysis {mood && <span>{moodStyles[mood].icon}</span>}
                    </h3>
                    {loading ? <div className="loader"></div> : <p>{moodAnalysis || "No data"}</p>}
                </div>

                {/* Tags */}
                <div className="card tags-card">
                    <h3>Tags</h3>
                    {loading ? (
                        <div className="loader"></div>
                    ) : tags.length > 0 ? (
                        tags.map((tag) => (
                            <span className="tag" key={tag}>
                {tag}
              </span>
                        ))
                    ) : (
                        "No tags"
                    )}
                </div>

                {/* Entries */}
                <div className="card full-width">
                    <h3>Entries</h3>
                    {loading ? (
                        <div className="loader"></div>
                    ) : entries.length > 0 ? (
                        <div className="entries-grid">
                            {entries.map((entry) => {

                                const isExpanded = expanded[entry.id];
                                return (
                                    <div
                                        className="entry-card"
                                        key={entry.id}
                                        data-mood={entry.mood || "NEUTRAL"} // Add mood as a data attribute
                                        onClick={() => router.push(`/write-entry/${entry.id}`)}
                                    >
                                        {entry.mood && <span className="mood-icon">{moodStyles[entry.mood].icon}</span>}
                                        <h4>{entry.title}</h4>
                                        <hr/>
                                        <p>
                                            {isExpanded || entry.content.length <= 100
                                                ? entry.content
                                                : `${entry.content.substring(0, 100)}...`}
                                        </p>
                                        {entry.content.length > 100 && (
                                            <button
                                                className="read-more"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpanded((prev) => ({
                                                        ...prev,
                                                        [entry.id]: !prev[entry.id],
                                                    }));
                                                }}
                                            >
                                                {isExpanded ? "Read Less" : "Read More"}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No entries for this day.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
