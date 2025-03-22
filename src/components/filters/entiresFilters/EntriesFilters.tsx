import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {Mood} from "@prisma/client"; // Import the Mood enum
import "./style.css";

const TIMEFRAMES = ["Today", "This Week", "This Month", "Last 3 Months", "This Year", "All"];

const TIMEFRAME_MAP: Record<string, string> = {
    "Today": "today",
    "This Week": "this_week",
    "This Month": "this_month",
    "Last 3 Months": "last_3_months",
    "This Year": "this_year",
    "All": "all"
};

interface Filters {
    timeframe: string;
    mood: Mood | ""; // Use the Mood enum type
    tags: string[];
}

const EntriesFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedFilters, setSelectedFilters] = useState<Filters>({
        timeframe: searchParams.get("timeframe") || "all",
        mood: (searchParams.get("mood") as Mood) || "", // Cast to Mood enum type
        tags: searchParams.get("tags") ? searchParams.get("tags")!.split(",") : [],
    });

    const updateFilters = (newFilters: Partial<Filters>) => {
        const updatedFilters: Filters = {
            ...selectedFilters,
            ...newFilters,
        };
        setSelectedFilters(updatedFilters);

        const params = new URLSearchParams();
        if (updatedFilters.timeframe && updatedFilters.timeframe !== "all") {
            const timeframeKey = TIMEFRAMES.find((t) => t === updatedFilters.timeframe);
            if (timeframeKey) {
                params.set("timeframe", TIMEFRAME_MAP[timeframeKey]);
            }
        }
        if (updatedFilters.mood) {
            params.set("mood", updatedFilters.mood);
        }
        if (updatedFilters.tags && updatedFilters.tags.length) {
            params.set("tags", updatedFilters.tags.join(","));
        }

        router.push(`/entries?${params.toString()}`);
    };

    return (
        <div className="filters-container">
            <h3>Filters</h3>

            {/* Timeframe Filter */}
            <label>Timeframe</label>
            <select
                value={selectedFilters.timeframe}
                onChange={(e) => updateFilters({timeframe: e.target.value})}
            >
                {TIMEFRAMES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>

            {/* Mood Filter */}
            <label>Mood</label>
            <select
                value={selectedFilters.mood}
                onChange={(e) => updateFilters({mood: e.target.value as Mood})}
            >
                <option value="">All</option>
                {Object.values(Mood).map((mood) => ( // Use Object.values to get enum values
                    <option key={mood} value={mood}>
                        {mood.charAt(0) + mood.slice(1).toLowerCase()}
                    </option>
                ))}
            </select>

            {/* Clear Filters */}
            <button className="clear-filters" onClick={() => updateFilters({timeframe: "all", mood: "", tags: []})}>
                Clear Filters
            </button>
        </div>
    );
};

export default EntriesFilters;