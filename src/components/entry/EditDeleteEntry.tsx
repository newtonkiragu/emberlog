"use client";

import {useState, useEffect, useCallback} from "react";
import {useRouter, useParams} from "next/navigation";
import './styles.css';

const EditDeleteEntry = () => {
    const router = useRouter();
    const params = useParams();
    const entryId = params?.id;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchEntry = useCallback(async () => {
        if (!entryId) return;
        try {
            const res = await fetch(`/api/v1/entries/${entryId}`);
            if (!res.ok) throw new Error("Failed to fetch entry");
            const data = await res.json();

            setTitle(data.title);
            setContent(data.content);
            setTags(data.tags?.map((tag: { name: string }) => tag.name) || []);
        } catch (err) {
            setError("Failed to load entry.");
        }
    }, [entryId]);

    useEffect(() => {
        fetchEntry();
    }, [fetchEntry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Both title and content are required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/v1/entries/${entryId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content, tags}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update entry.");
            }

            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!entryId) return;
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            const res = await fetch(`/api/v1/entries/${entryId}`, {method: "DELETE"});

            if (!res.ok) throw new Error("Failed to delete entry");

            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="entry-container">
            {error && <p className="error" aria-live="polite">{error}</p>}

            {isEditing ? (
                // Edit Mode: Show Form
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
                        <button type="button" className="cancel button-warning" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="submit">
                            {loading ? "Saving..." : "Save Entry"}
                        </button>
                    </div>
                </form>
            ) : (
                // View Mode: Show Entry Content with Formatting
                <div className="entry-view">
                    <h2>{title}</h2>
                    <pre className="entry-content">{content}</pre>
                    <div className="tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="button-group">
                        <button type="button" className="edit button-primary" onClick={() => setIsEditing(true)}>
                            Edit Entry
                        </button>
                        <button type="button" className="delete button-error" onClick={handleDelete}>
                            Delete Entry
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditDeleteEntry;
