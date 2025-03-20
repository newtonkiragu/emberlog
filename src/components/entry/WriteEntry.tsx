"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import './styles.css';

const Entry = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Both title and content are required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/v1/entries", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save entry.");
            }

            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="entry-container">
            <h2>Write New Entry</h2>
            {error && <p className="error" aria-live="polite">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="entry-input"
                />

                <label>Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    className="entry-textarea"
                ></textarea>

                <div className="button-group">
                    <button type="button" className="cancel button-warning" onClick={() => router.push("/dashboard")}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="submit">
                        {loading ? "Saving..." : "Save Entry"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Entry;
