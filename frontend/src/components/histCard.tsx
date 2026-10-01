import type { SavedAnalysis } from "../types/feedback";
import { useNavigate } from "react-router-dom";

type HistoryCardProps = {
    analysis: SavedAnalysis;
    onDelete: (id: string) => void;
};

function HistoryCard({ analysis, onDelete }: HistoryCardProps) {
    const navigate = useNavigate();

    const isSingle = analysis.analysis_type === "single";

    const urgency = isSingle
        ? (analysis.results as { urgency?: string })?.urgency
        : undefined;

    const urgencyStyles: Record<string, string> = {
        low: "bg-green-50 text-green-600",
        medium: "bg-orange-50 text-orange-600",
        high: "bg-red-50 text-red-600",
    };

    const urgencyClass = urgency
        ? urgencyStyles[urgency.toLowerCase()]
        : "";

    return (
        <div
            className="
                w-full
                bg-white
                border border-zinc-200
                rounded-sm
                px-3 py-2.5
                flex items-center gap-3
                hover:border-blue-200
                hover:shadow-sm
                transition-all
            "
        >
            {/* Type */}
            <span
                className="
                    shrink-0
                    px-2 py-1
                    rounded
                    bg-blue-50
                    text-blue-600
                    border border-blue-100
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wide
                "
            >
                {isSingle ? "Single" : "Batch"}
            </span>

            {/* Urgency */}
            {urgency && (
                <span
                    className={`
                        shrink-0
                        px-2 py-1
                        rounded
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${urgencyClass}
                    `}
                >
                    {urgency}
                </span>
            )}

            {/* Main content */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 truncate">
                    {isSingle ? analysis.feedback : analysis.file_name}
                </p>
            </div>

            {/* review Count */}
            <span className="hidden sm:block shrink-0 text-[11px] text-zinc-400">
                {isSingle
                    ? "1 review"
                    : `${analysis.total_reviews} reviews`}
            </span>

            <span className="hidden md:block shrink-0 text-[11px] text-zinc-400">
                {new Date(analysis.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </span>

            {/* Delete */}
            <button
                onClick={() => onDelete(analysis.id)}
                className="
                    shrink-0
                    px-2.5 py-1.5
                    rounded-sm
                    text-xs
                    font-medium
                    text-red-600
                    hover:bg-red-50
                    transition-colors
                    cursor-pointer
                "
            >
                Delete
            </button>

            {/* View */}
            <button
                onClick={() => navigate(`/history/${analysis.id}`)}
                className="
                    shrink-0
                    flex items-center gap-1.5
                    px-3 py-1.5
                    rounded-sm
                    bg-blue-600
                    text-white
                    text-xs
                    font-medium
                    hover:bg-blue-700
                    transition-colors
                    cursor-pointer
                "
            >
                View
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

export default HistoryCard;