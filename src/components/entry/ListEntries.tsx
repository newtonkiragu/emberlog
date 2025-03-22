'use client'

import {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import EntriesList from "@/components/entriesList/EntriesList";
import "./styles.css";
import EntriesFilters from "@/components/filters/entiresFilters/EntriesFilters";

const ListEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchEntries = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams(searchParams.toString());
                const response = await fetch(`/api/v1/entries?${query}`);
                const data = await response.json();
                setEntries(data.entries);
            } catch (error) {
                console.error("Error fetching entries:", error);
            }
            setLoading(false);
        };

        fetchEntries();
    }, [searchParams]);

    return (
        <div className="entries-container">
            <main className="entries-content">
                <h1>Journal Entries</h1>
                <EntriesList entries={entries} loading={loading}/>
            </main>
            <aside className="filters-sidebar">
                <EntriesFilters/>
            </aside>
        </div>
    );
};

export default ListEntries;
