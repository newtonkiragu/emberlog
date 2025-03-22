import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import enUS from "date-fns/locale/en-US";
import {Entry, Mood} from "@prisma/client";
import "./style.css";
import EntriesList from "@/components/entriesList/EntriesList";
import moodStyles from "@/util/globals/moodStyles";

interface DashboardData {
    entries: Entry[];
    moodAnalysis: string | null;
    tags: string[];
    mood: Mood | null;
}

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [data, setData] = useState<DashboardData>({entries: [], moodAnalysis: null, tags: [], mood: null});
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDate) return;
            setLoading(true);
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd", {locale: enUS});
                const response = await fetch(`/api/v1/dashboard?date=${formattedDate}`);
                const result: DashboardData = await response.json();
                if (response.ok) {
                    setData(result);
                } else {
                    console.error("Error fetching dashboard data:", result);
                }
            } catch (error) {
                console.error("Error:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [selectedDate]);

    return (
        <div className="container dashboard-container">
            {/* Date Navigation */}
            <div className="date-navigation">
                <button className="button-outline"
                        onClick={() => setSelectedDate(new Date(selectedDate!.getTime() - 86400000))}>←
                </button>
                <h2>{selectedDate ? format(selectedDate, "PPP", {locale: enUS}) : ""}</h2>
                <button className="button-outline"
                        onClick={() => setSelectedDate(new Date(selectedDate!.getTime() + 86400000))}>→
                </button>
                <button className="button-primary" onClick={() => setSelectedDate(new Date())}>Today</button>
            </div>

            {/* Write Button */}
            {selectedDate && format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && (
                <div className="write-entry">
                    <button className="button-primary" onClick={() => router.push("/write-entry")}>
                        Write Something
                    </button>
                </div>
            )}

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
                {/* Mood Analysis */}
                <div className="card mood-card"
                     style={{backgroundColor: data.mood ? moodStyles[data.mood].color : "#ccc"}}>
                    <h3>Mood Analysis {data.mood && <span>{moodStyles[data.mood].icon}</span>}</h3>
                    {loading ? <div className="loader"></div> : <p>{data.moodAnalysis || "No data"}</p>}
                </div>

                {/* Tags */}
                <div className="card tags-card">
                    <h3>Tags</h3>
                    {loading ? (
                        <div className="loader"></div>
                    ) : data.tags.length > 0 ? (
                        data.tags.map((tag) => (
                            <span className="tag" key={tag}>
                {tag}
              </span>
                        ))
                    ) : (
                        "No tags"
                    )}
                </div>

                {/* Entries */}
                <div className="card full-width">
                    <h3>Entries</h3>
                    <EntriesList entries={data.entries} loading={loading}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
