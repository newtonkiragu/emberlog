"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Box, Button, Container, Typography, Card, CardContent, CircularProgress} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {format} from "date-fns";

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [entries, setEntries] = useState<any[]>([]);
    const [moodAnalysis, setMoodAnalysis] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/dashboard?date=${format(selectedDate, "yyyy-MM-dd")}`);
            const data = await response.json();
            if (response.ok) {
                setEntries(data.entries);
                setMoodAnalysis(data.moodAnalysis);
                setTags(data.tags);
            } else {
                console.error("Error fetching dashboard data:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    return (
        <Container maxWidth="md">
            {/* Date Navigation */}
            <Box display="flex" justifyContent="center" alignItems="center" my={3} gap={1}>
                <Button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>
                    ←
                </Button>
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    slotProps={{
                        textField: {
                            variant: "outlined",
                        },
                    }}
                />
                <Button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}>
                    →
                </Button>
                <Button onClick={() => setSelectedDate(new Date())} sx={{ml: 2}} variant="contained">
                    Today
                </Button>
            </Box>

            {/* Write Button */}
            {format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && (
                <Box display="flex" justifyContent="center" mb={3}>
                    <Button variant="contained" onClick={() => router.push("/write-entry")}>
                        Write Something
                    </Button>
                </Box>
            )}

            {/* Main Content */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress/>
                </Box>
            ) : (
                <>
                    {/* Entries */}
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {entries.length > 0 ? (
                            entries.map((entry, index) => (
                                <Card key={index} sx={{minWidth: 250}}>
                                    <CardContent>
                                        <Typography variant="h6">{entry.title}</Typography>
                                        <Typography variant="body2">{entry.content}</Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card sx={{minWidth: 250, textAlign: "center", p: 2}}>
                                <Typography variant="body2">No entries for this day.</Typography>
                            </Card>
                        )}
                    </Box>

                    {/* Mood & Tags */}
                    <Box display="flex" flexDirection="column" gap={2} mt={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Mood Analysis</Typography>
                                {moodAnalysis ? (
                                    <Typography>{moodAnalysis}</Typography>
                                ) : (
                                    <Typography variant="body2">No mood data available.</Typography>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6">Frequent Tags</Typography>
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => <Typography key={index}>#{tag}</Typography>)
                                ) : (
                                    <Typography variant="body2">No tags found.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default Dashboard;
