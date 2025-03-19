"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {TextField, Button, Container, Typography, Box} from "@mui/material";

const Entry = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/v1/entries", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content}),
            });
            console.log(res)

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to save entry.");
                setLoading(false);
                return;
            }

            router.push("/dashboard"); // Redirect back to dashboard
        } catch (error) {
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" textAlign="center" my={3}>Write New Entry</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                <TextField label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)}
                           fullWidth required/>
                <TextField label="Content" variant="outlined" value={content}
                           onChange={(e) => setContent(e.target.value)} fullWidth required multiline rows={4}/>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Entry"}
                </Button>
            </Box>
        </Container>
    );
};

export default Entry;
