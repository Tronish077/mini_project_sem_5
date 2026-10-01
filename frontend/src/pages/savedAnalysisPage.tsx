import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnalysisById } from "../services/supaFuncs";
import type {
    ResultsState,
    FeedbackResponse,
    CsvReviewResult,
} from "../types/feedback";

function SavedAnalysisPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAnalysis() {
            try {
                if (!id) {
                    throw new Error("Analysis ID is missing.");
                }

                const analysis = await getAnalysisById(id);

                let state: ResultsState;

                if (analysis.analysis_type === "single") {
                    state = {
                        mode: "single",
                        feedback: analysis.feedback ?? "",
                        data: analysis.results as FeedbackResponse,
                        source: "history"
                    };
                } else {
                    state = {
                        mode: "csv",
                        data: {
                            file_name: analysis.file_name ?? "",
                            total_reviews: analysis.total_reviews ?? 0,
                            results: analysis.results as CsvReviewResult[],
                        },
                        source: "history"
                    };
                }

                navigate("/results", {
                    state,
                    replace: true,
                });

            } catch (err) {
                console.error(err);
                setError("Failed to load this analysis.");
                setLoading(false);
            }
        }

        loadAnalysis();
    }, [id, navigate]);

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
                        Loading Analysis ...
                    </p>
                </div>
            </div>
        );
    }

    return <div>{error}</div>;
}

export default SavedAnalysisPage;