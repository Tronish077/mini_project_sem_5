import type {FeedbackResponse, CsvReviewResult } from "../types/feedback";
import { SaveIcon } from "../components/icons/svgIcons";

// ── Helpers ──────────────────────────────────────────────────
function getSentimentClass(val: string) {
    const v = val?.toLowerCase();
    if (v === "positive") return "positive";
    if (v === "negative") return "negative";
    return "neutral";
}

function getUrgencyClass(val: string) {
    const v = val?.toLowerCase();
    if (v === "high") return "high";
    if (v === "low") return "low";
    return "medium";
}

function sentimentIcon(val: string) {
    const v = val?.toLowerCase();
    if (v === "positive") return "😊";
    if (v === "negative") return "😟";
    if (v === "mixed") return "😐";
    return "🔍";
}

function sentimentColor(val: string) {
    const v = val?.toLowerCase();
    if (v === "positive") return "var(--positive)";
    if (v === "negative") return "var(--negative)";
    return "var(--warning)";
}

function urgencyColor(val: string) {
    const v = val?.toLowerCase();
    if (v === "high") return "var(--negative)";
    if (v === "low") return "var(--positive)";
    return "var(--warning)";
}

// ── Export helpers ────────────────────────────────────────────
function escapeCsvCell(val: string): string {
    if (!val) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function exportToCsv(fileName: string, results: CsvReviewResult[]) {
    const headers = [
        "Review",
        "Sentiment",
        "Emotion",
        "Urgency",
        "Business Impact",
        "Positive Topics",
        "Negative Topics",
        "Summary",
        "Recommendation",
    ];
    const rows = results.map((r) => [
        escapeCsvCell(r.review),
        escapeCsvCell(r.analysis.sentiment),
        escapeCsvCell(r.analysis.emotion),
        escapeCsvCell(r.analysis.urgency),
        escapeCsvCell(r.analysis.business_impact),
        escapeCsvCell(r.analysis.positive_topics?.join("; ") ?? ""),
        escapeCsvCell(r.analysis.negative_topics?.join("; ") ?? ""),
        escapeCsvCell(r.analysis.summary),
        escapeCsvCell(r.analysis.recommendation),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.csv$/i, "") + "_analysis_report.csv";
    a.click();
    URL.revokeObjectURL(url);
}

export function exportSingleToCsv(data: FeedbackResponse) {
    const headers = [
        "Sentiment", "Emotion", "Urgency", "Business Impact",
        "Positive Topics", "Negative Topics", "Summary", "Recommendation",
    ];
    const row = [
        escapeCsvCell(data.sentiment),
        escapeCsvCell(data.emotion),
        escapeCsvCell(data.urgency),
        escapeCsvCell(data.business_impact),
        escapeCsvCell(data.positive_topics?.join("; ") ?? ""),
        escapeCsvCell(data.negative_topics?.join("; ") ?? ""),
        escapeCsvCell(data.summary),
        escapeCsvCell(data.recommendation),
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback_analysis_report.csv";
    a.click();
    URL.revokeObjectURL(url);
}


// ── Single analysis panel (full detail) ──────────────────────
export function AnalysisPanel({ data, title }: { data: FeedbackResponse; title?: string }) {
    return (
        <div className="rp-panel-body">
            {title && (
                <div className="rp-panel-review">
                    <span className="rp-panel-review-label">Review</span>
                    <p className="rp-panel-review-text">"{title}"</p>
                </div>
            )}

            <div className="rp-metrics">
                <div className={`rp-metric ${getSentimentClass(data.sentiment)}`}>
                    <span className="rp-metric-icon">{sentimentIcon(data.sentiment)}</span>
                    <div>
                        <div className="rp-metric-label">Sentiment</div>
                        <div className="rp-metric-value">{data.sentiment}</div>
                    </div>
                </div>
                <div className="rp-metric">
                    <span className="rp-metric-icon">💭</span>
                    <div>
                        <div className="rp-metric-label">Emotion</div>
                        <div className="rp-metric-value">{data.emotion}</div>
                    </div>
                </div>
                <div className={`rp-metric ${getUrgencyClass(data.urgency)}`}>
                    <span className="rp-metric-icon">⚡</span>
                    <div>
                        <div className="rp-metric-label">Urgency</div>
                        <div className="rp-metric-value">{data.urgency}</div>
                    </div>
                </div>
                <div className="rp-metric">
                    <span className="rp-metric-icon">📈</span>
                    <div>
                        <div className="rp-metric-label">Business Impact</div>
                        <div className="rp-metric-value">{data.business_impact}</div>
                    </div>
                </div>
            </div>

            <div className="rp-topics">
                <div className="rp-topic-col">
                    <div className="rp-topic-heading">
                        <span className="rp-topic-dot positive-dot" /> Positive Topics
                    </div>
                    <div className="rp-tags">
                        {data.positive_topics?.length > 0
                            ? data.positive_topics.map((t) => <span key={t} className="rp-tag positive-tag">{t}</span>)
                            : <span className="rp-tag-empty">None identified</span>}
                    </div>
                </div>
                <div className="rp-topic-col">
                    <div className="rp-topic-heading">
                        <span className="rp-topic-dot negative-dot" /> Negative Topics
                    </div>
                    <div className="rp-tags">
                        {data.negative_topics?.length > 0
                            ? data.negative_topics.map((t) => <span key={t} className="rp-tag negative-tag">{t}</span>)
                            : <span className="rp-tag-empty">None identified</span>}
                    </div>
                </div>
            </div>

            <div className="rp-info-row">
                <div className="rp-info-block">
                    <div className="rp-info-label">Summary</div>
                    <p className="rp-info-text">{data.summary}</p>
                </div>
                <div className="rp-info-block">
                    <div className="rp-info-label">Recommendation</div>
                    <p className="rp-info-text">{data.recommendation}</p>
                </div>
            </div>
        </div>
    );
}

// ── Collapsible accordion row (CSV mode) ─────────────────────
export function ReviewRow({
    item,
    globalIndex,
    isOpen,
    onToggle,
}: {
    item: CsvReviewResult;
    index: number;
    globalIndex: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const a = item.analysis;
    return (
        <div className={`rv-row glass-card ${isOpen ? "rv-row-open" : ""}`}>
            {/* Collapsed header — always visible */}
            <button className="rv-header" onClick={onToggle} aria-expanded={isOpen}>
                <span className="rv-num">#{globalIndex + 1}</span>
                <span className="rv-preview">{item.review.slice(0, 90)}{item.review.length > 90 ? "…" : ""}</span>
                <div className="rv-badges">
                    <span
                        className="rv-badge"
                        style={{ color: sentimentColor(a.sentiment), borderColor: sentimentColor(a.sentiment) + "55", background: sentimentColor(a.sentiment) + "15" }}
                    >
                        {sentimentIcon(a.sentiment)} {a.sentiment}
                    </span>
                    <span
                        className="rv-badge"
                        style={{ color: urgencyColor(a.urgency), borderColor: urgencyColor(a.urgency) + "55", background: urgencyColor(a.urgency) + "15" }}
                    >
                        ⚡ {a.urgency}
                    </span>
                    <span className="rv-badge rv-badge-emotion">💭 {a.emotion}</span>
                </div>
                <span className={`rv-chevron ${isOpen ? "rv-chevron-open" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {/* Expanded detail */}
            {isOpen && (
                <div className="rv-detail">
                    <AnalysisPanel data={a} />
                </div>
            )}
        </div>
    );
}

// Csv summary bar
export function CsvSummaryBar({
    results,
    onFilterSentiment,
    activeSentiment,
}: {
    results: CsvReviewResult[];
    onFilterSentiment: (s: string) => void;
    activeSentiment: string;
}) {
    const total = results.length;
    const positive = results.filter((r) => r.analysis.sentiment?.toLowerCase() === "positive").length;
    const negative = results.filter((r) => r.analysis.sentiment?.toLowerCase() === "negative").length;
    const mixed = total - positive - negative;
    const highUrgency = results.filter((r) => r.analysis.urgency?.toLowerCase() === "high").length;

    const stats = [
        { label: "Total", value: total, icon: "📋", cls: "", filter: "" },
        { label: "Positive", value: positive, icon: "✅", cls: "positive", filter: "positive" },
        { label: "Negative", value: negative, icon: "❌", cls: "negative", filter: "negative" },
        { label: "Mixed", value: mixed, icon: "⚖️", cls: "neutral", filter: "mixed" },
        { label: "High Urgency", value: highUrgency, icon: "🚨", cls: "high", filter: "" },
    ];

    return (
        <div className="rp-summary-bar">
            {stats.map(({ label, value, icon, cls, filter }) => (
                <button
                    key={label}
                    className={`rp-summary-chip ${cls} ${activeSentiment === filter && filter ? "rp-chip-active" : ""}`}
                    onClick={() => filter && onFilterSentiment(activeSentiment === filter ? "" : filter)}
                    style={{ cursor: filter ? "pointer" : "default" }}
                    title={filter ? `Filter by ${label}` : undefined}
                >
                    <span className="rp-summary-icon">{icon}</span>
                    <span className="rp-summary-value">{value}</span>
                    <span className="rp-summary-label">{label}</span>
                </button>
            ))}
        </div>
    );
}

//  Toolbar for searching and sorting + filter
const SORT_OPTIONS = [
    { value: "index", label: "Original Order" },
    { value: "sentiment-asc", label: "Sentiment: Pos → Neg" },
    { value: "sentiment-desc", label: "Sentiment: Neg → Pos" },
    { value: "urgency-desc", label: "Urgency: High → Low" },
    { value: "urgency-asc", label: "Urgency: Low → High" },
];

export function Toolbar({
    search,
    onSearch,
    sort,
    onSort,
    urgency,
    onUrgency,
    total,
    filtered,
}: {
    search: string;
    onSearch: (v: string) => void;
    sort: string;
    onSort: (v: string) => void;
    urgency: string;
    onUrgency: (v: string) => void;
    total: number;
    filtered: number;
}) {
    return (
        <div className="rp-toolbar glass-card">
            {/* Search */}
            <div className="rp-search-wrap">
                <svg className="rp-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    id="rp-search"
                    className="rp-search-input"
                    type="text"
                    placeholder="Search reviews…"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
                {search && (
                    <button className="rp-search-clear" onClick={() => onSearch("")} aria-label="Clear search">✕</button>
                )}
            </div>

            {/* Urgency filter pills */}
            <div className="rp-filter-pills">
                {["", "high", "medium", "low"].map((u) => (
                    <button
                        key={u || "all"}
                        className={`rp-pill ${urgency === u ? "rp-pill-active" : ""}`}
                        onClick={() => onUrgency(u)}
                    >
                        {u === "" ? "All Urgency" : u.charAt(0).toUpperCase() + u.slice(1)}
                    </button>
                ))}
            </div>

            {/* Sort */}
            <div className="rp-sort-wrap">
                <select
                    id="rp-sort"
                    className="rp-sort-select"
                    value={sort}
                    onChange={(e) => onSort(e.target.value)}
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Result count */}
            <span className="rp-result-count">
                {filtered === total ? `${total} results` : `${filtered} of ${total} results`}
            </span>
        </div>
    );
}


export function Pagination({
    page,
    pageSize,
    total,
    onChange,
}: { page: number;pageSize:number; total: number; onChange: (p: number) => void }) {
    const pages = Math.ceil(total / pageSize);
    if (pages <= 1) return null;

    // Show up to 7 page buttons with ellipsis
    const getPageNums = () => {
        if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
        const nums: (number | "…")[] = [1];
        if (page > 3) nums.push("…");
        for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
        if (page < pages - 2) nums.push("…");
        nums.push(pages);
        return nums;
    };

    return (
        <div className="rp-pagination">
            <button className="rp-page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            {getPageNums().map((n, i) =>
                n === "…"
                    ? <span key={`e${i}`} className="rp-page-ellipsis">…</span>
                    : <button
                        key={n}
                        className={`rp-page-btn ${page === n ? "rp-page-active" : ""}`}
                        onClick={() => onChange(n as number)}
                    >{n}</button>
            )}
            <button className="rp-page-btn" disabled={page === pages} onClick={() => onChange(page + 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
        </div>
    );
}

// Export Button
export function ExportButton({ onClick }: { onClick: () => void }) {
    return (
        <button id="export-btn" className="export-btn" onClick={onClick}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV Report
        </button>
    );
}

// Save Button
export function SaveButton({ onClick,saving }: { onClick: () => void ,saving:boolean}) {
    return (
        <button
            id="save-btn"
            className={` save-btn ${saving ? "opacity-70 cursor-not-allowed":""}`}
            onClick={onClick}
        >
            {saving ?(
                <span
                    className="
                        w-4 h-4
                        border-2
                        border-white/40
                        border-t-white
                        rounded-full
                        animate-spin
                    "
                />
            ) :   <SaveIcon/>}
            {saving ? "Saving Analysis" : "Save Analysis"}
        </button>
    );
}
