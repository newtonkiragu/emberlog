"use client";

import "./style.css";
import {Entry} from "@prisma/client";
import EntryCard from "@/components/entryCard/EntryCard";

interface EntriesListProps {
    entries: Entry[];
    loading: boolean;
}

const EntriesList = ({ entries, loading }: EntriesListProps) => {
    if (loading) {
        return <div className="loader"></div>;
    }

    if (entries.length === 0) {
        return <p>No entries for this day.</p>;
    }

    return (
        <div className="entries-grid">
            {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
            ))}
        </div>
    );
};

export default EntriesList;
