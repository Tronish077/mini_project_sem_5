import { useEffect, useState } from "react";
import { deleteAnalysis, getSavedAnalyses } from "../services/supaFuncs";
import type { SavedAnalysis } from "../types/feedback";
import HistoryCard from "../components/histCard";
import { useNavigate } from "react-router-dom";
import SuccessToast from "../components/toasts/successToast";
import ErrorToast from "../components/toasts/errorToast";
import { EmptyHistory } from "../components/icons/svgIcons";

function HistoryPage() {
    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await getSavedAnalyses();
                setAnalyses(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load analysis history.");
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="
                            w-10 h-10
                            border-4 border-zinc-200
                            border-t-blue-600
                            rounded-full
                            animate-spin
                        "
                    />

                    <p className="text-sm font-medium text-zinc-500">
                        Loading History...
                    </p>
                </div>
            </div>
        );
    }

    async function handleDelete(id: string) {
        const previousAnalyses = analyses;

        // Instant UI update
        setAnalyses((current) =>
            current.filter((analysis) => analysis.id !== id)
        );

        try {
            await deleteAnalysis(id);
            setMessage("Deleted Successfully");
        } catch (err) {
            // Restore if database deletion failed
            setAnalyses(previousAnalyses);

            setError("Failed to delete analysis.");
        }

        setTimeout(() => {
            setMessage("");
            setError("");
        }, 3000);
    }


    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-6 animate-fadeUp">
            <div className="flex items-center gap-4 mb-2">
                <button id="results-back-btn" className="back-btn" onClick={() => navigate("/dashboard")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </button>

                <div>
                    <h1 className="font-bold text-2xl text-zinc-900">Analysis History</h1>
                    <p className="text-sm text-zinc-500">Your previously saved feedback analyses</p>
                </div>
            </div>

            {
                analyses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {analyses.map((analysis) => (
                            <HistoryCard
                                key={analysis.id}
                                analysis={analysis}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col bg-white rounded-md border border-zinc-200 items-center justify-center text-center gap-4 py-16 px-6">

                        {/* Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-2">
                            <EmptyHistory/>
                        </div>

                        {/* Text */}
                        <h2 className="font-semibold text-xl text-zinc-900 mb-1">
                            No saved analyses yet
                        </h2>

                        <p className="text-sm text-zinc-500 max-w-sm mb-6">
                            Analyses you choose to save will appear here so you can view them again later.
                        </p>

                        {/* CTA */}
                        <button
                            onClick={() => navigate("/main")}
                            className="px-6 py-3 rounded-md bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition cursor-pointer"
                        >
                            Analyze Feedback
                        </button>

                    </div>
                )
            }

            {message && (
                <SuccessToast Textmessage={message} />
            )}

            {error && (
                    <ErrorToast Textmessage={error} />
                )}

        </div>
    );
}

export default HistoryPage;