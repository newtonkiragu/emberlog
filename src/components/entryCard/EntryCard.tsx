"use client";

import {useRouter} from "next/navigation";
import {Mood} from "@prisma/client";
import {useState} from "react";
import moodStyles from "@/util/globals/moodStyles";

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
    mood: Mood;
    tags: Tag[];
}

interface EntryCardProps {
    entry: Entry;
}

const EntryCard = ({entry}: EntryCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    return (
        <div
            className="entry-card"
            data-mood={entry.mood || "NEUTRAL"}
            onClick={() => router.push(`/write-entry/${entry.id}`)}
        >
            {entry.mood && <span className="mood-icon">{moodStyles[entry.mood].icon}</span>}
            <h4>{entry.title}</h4>
            <hr/>
            <p>
                {`${entry.content.substring(0, 100)}...`}
            </p>
            {entry.content.length > 100 && (
                <button
                    className="read-more"
                    onClick={() => router.push(`/write-entry/${entry.id}`)}
                >
                    {isExpanded ? "Read Less" : "Read More"}
                </button>
            )}
        </div>
    );
};

export default EntryCard;
