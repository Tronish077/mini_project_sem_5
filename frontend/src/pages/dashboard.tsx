import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/supaFuncs";
import type { DashboardStats } from "../types/feedback";
import UrgencyChart from "../components/charts/urgencyChart";
import BusinessImpactChart from "../components/charts/businessImpactChart";
import SentimentChart from "../components/charts/sentimentChart";
import EmotionChart from "../components/charts/emotionChart";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/userHeader";
import { EmptyAnalytics } from "../components/icons/svgIcons";
import { DefaultLoader } from "../components/loaders/defaultLoader";

// stat card props
type StatCardProps = {
    label: string;
    value: string | number;
    sub?: string;
    dot?: string; // color dot
};

function StatCard({ label, value, sub, dot }: StatCardProps) {
    return (
        <div style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {dot && (
                    <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: dot,
                        flexShrink: 0,
                        display: "inline-block",
                    }} />
                )}
                <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#6b7280",
                    letterSpacing: "0.01em",
                }}>
                    {label}
                </span>
            </div>
            <p style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1,
            }}>
                {value}
            </p>
            {sub && (
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                    {sub}
                </p>
            )}
        </div>
    );
}

// Segment prop

type SegOption = { label: string; value: string };

function SegmentControl({
    options,
    value,
    onChange,
}: {
    options: SegOption[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div style={{
            display: "flex",
            background: "#f3f4f6",
            borderRadius: 8,
            padding: 2,
            gap: 1,
        }}>
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    style={{
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.14s ease",
                        background: value === opt.value ? "#ffffff" : "transparent",
                        color: value === opt.value ? "#2563eb" : "#6b7280",
                        boxShadow: value === opt.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

// Options
const PERIOD_OPTIONS: SegOption[] = [
    { label: "All time", value: "all" },
    { label: "7 days",   value: "7d"  },
    { label: "30 days",  value: "30d" },
];

const TYPE_OPTIONS: SegOption[] = [
    { label: "All",    value: "all"    },
    { label: "Single", value: "single" },
    { label: "Batch",  value: "batch"  },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [period, setPeriod] = useState("all");
    const [analysisType, setAnalysisType] = useState("all");
    const navigate = useNavigate();

    const isFirstLoad = stats === null && !error;

    useEffect(() => {
        async function loadDashboard() {
            if (stats !== null) setRefreshing(true);
            try {
                const data = await getDashboardStats(period, analysisType);
                setStats(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard.");
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
        loadDashboard();
    }, [period, analysisType]);

    if (loading && isFirstLoad) {
        return (<DefaultLoader/>)
    }

    if (error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#9ca3af", fontSize: 14 }}>No data available.</p>
            </div>
        );
    }

    const positivePercentage = stats.total_reviews > 0
        ? Math.round((stats.sentiment.positive / stats.total_reviews) * 100)
        : 0;

    const negativePercentage = stats.total_reviews > 0
        ? Math.round((stats.sentiment.negative / stats.total_reviews) * 100)
        : 0;

    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideRight {
                    from { transform: translateX(-100%); }
                    to   { transform: translateX(400%); }
                }
            `}</style>

            <div style={{ minHeight: "100vh",width:"80vw", background: "#f9fafb" }}>
                <UserHeader />

                {/* Refresh indicator */}
                <div style={{ height: 2, background: "#f3f4f6", overflow: "hidden" }}>
                    {refreshing && (
                        <div style={{
                            height: "100%",
                            width: "30%",
                            background: "#2563eb",
                            borderRadius: 99,
                            animation: "slideRight 0.9s ease infinite",
                        }} />
                    )}
                </div>

                <div style={{ width: "100%", padding: "32px 28px 64px" }}>

                    {/*Page header*/}
                    <div className={"flex flex-wrap justify-between gap-4 pb-4"}>
                        <div>
                            <h1 style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#111827",
                                margin: 0,
                                letterSpacing: "-0.02em",
                            }}>
                                Overview
                            </h1>
                            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
                                Summary of your saved feedback analyses
                            </p>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                            <SegmentControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
                            <SegmentControl options={TYPE_OPTIONS}  value={analysisType} onChange={setAnalysisType} />
                            <button
                                onClick={() => navigate("/main")}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 14px",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "#ffffff",
                                    background: "#2563eb",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    transition: "background 0.15s",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                New analysis
                            </button>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                        gap: 12,
                        marginBottom: 28,
                    }}>
                        <StatCard
                            label="Total reviews"
                            value={stats.total_reviews}
                            sub="across all analyses"
                        />
                        <StatCard
                            label="Positive sentiment"
                            value={`${positivePercentage}%`}
                            sub={`${stats.sentiment.positive} reviews`}
                            dot="#16a34a"
                        />
                        <StatCard
                            label="Negative sentiment"
                            value={`${negativePercentage}%`}
                            sub={`${stats.sentiment.negative} reviews`}
                            dot="#dc2626"
                        />
                        <StatCard
                            label="High urgency"
                            value={stats.urgency.high}
                            sub="need attention"
                            dot="#d97706"
                        />
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 24 }} />
                    

                    {/* Conditional rendering for graphs */}
                    {
                        stats.total_reviews > 0 ? (
                            <>
                                                             {/* ── Charts ── */}
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 16px" }}>
                                Breakdowns
                            </p>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                                gap: 12,
                            }}>
                                {[
                                    <SentimentChart sentiment={stats.sentiment} />,
                                    <EmotionChart emotions={stats.emotions} />,
                                    <UrgencyChart urgency={stats.urgency} />,
                                    <BusinessImpactChart businessImpact={stats.business_impact} />,
                                ].map((chart, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            height: 380,
                                            background: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 12,
                                            overflow: "hidden",
                                        }}
                                    >
                                        {chart}
                                    </div>
                                ))}
                            </div>
                            </>
                        )  :
                        (
                    <div className="flex flex-col bg-white rounded-md border-1 border-zinc-200 items-center justify-center text-center gap-4 py-16 px-6">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-blue-600 mb-2">
                            <EmptyAnalytics/>
                        </div>

                        {/* Text */}
                        <h2 className="font-semibold text-xl text-zinc-900 mb-1">
                            Nothing to see here
                        </h2>

                        <p className="text-sm text-zinc-500 max-w-sm mb-6">
                            Analytics will appear here once you have feedback data.                       
                        </p>

                        {/* CTA */}
                        <button onClick={() => navigate("/main")}
                            className="px-6 py-3 rounded-sm bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition cursor-pointer"
                        >
                            Analyze Feedback
                        </button>

                    </div>
                )
                    }
                </div>
            </div>
        </>
    );
}

export default DashboardPage;