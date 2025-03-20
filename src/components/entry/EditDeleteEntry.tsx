"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import './styles.css';

const EditDeleteEntry = () => {
    const router = useRouter();
    const params = useParams();
    const entryId = params?.id;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, tags }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update entry.");
            }

            router.push("/dashboard");
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
            const res = await fetch(`/api/v1/entries/${entryId}`, { method: "DELETE" });

            if (!res.ok) throw new Error("Failed to delete entry");

            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
        }
        setNewTag("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="entry-container">
            <h2>{entryId ? "Edit Entry" : "Write New Entry"}</h2>
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

                <label>Tags</label>
                <div className="tags-container">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag} <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                        </span>
                    ))}
                </div>
                <div className="tag-input">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <button type="button" onClick={handleAddTag}>Add</button>
                </div>

                <div className="button-group">
                    <button type="button" className="cancel button-warning" onClick={() => router.push("/dashboard")}>
                        Cancel
                    </button>
                    {entryId && (
                        <button type="button" className="delete button-error" onClick={handleDelete}>
                            Delete Entry
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="submit">
                        {loading ? "Saving..." : "Save Entry"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDeleteEntry;
