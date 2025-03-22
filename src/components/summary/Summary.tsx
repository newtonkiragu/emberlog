"use client";

import {useState, useEffect} from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell} from "recharts";
import "./style.css";

export default function SummaryView() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            const res = await fetch("/api/v1/entries/summary");
            const data = await res.json();
            setSummary(data);
            setLoading(false);
        }

        fetchSummary();
    }, []);

    if (loading) return <div className="loader"></div>;

    return (
        <div className="summary-container">
            <h2>Journal Summary</h2>

            <div className="card">
                <p><strong>Total Entries:</strong> {summary.totalEntries}</p>
                <p><strong>Average Word Count:</strong> {summary.avgWordCount.toFixed(2)}</p>
            </div>

            {/* Most Used Tags */}
            <div className="card">
                <h3>Most Used Tags</h3>
                <div className="tags-list">
                    {summary.mostUsedTags.map((tag: any) => (
                        <span className="tag" key={tag.tag}>{tag.tag} ({tag.count})</span>
                    ))}
                </div>
            </div>

            {/* Mood Trends */}
            <div className="card">
                <h3>Mood Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={summary.moodTrends}>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="mood" stroke="#8884d8"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Entry Frequency Heatmap */}
            <div className="card">
                <h3>Entry Frequency</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={Object.entries(summary.entryFrequency).map(([date, count]) => ({date, count}))}
                            dataKey="count"
                            nameKey="date"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#82ca9d"
                            label={({date, count}) => `${date}: ${count}`}
                        >
                            {Object.entries(summary.entryFrequency).map(([date], index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 ? "#0088FE" : "#00C49F"}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
