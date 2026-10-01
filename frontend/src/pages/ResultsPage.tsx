import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { ResultsState} from "../types/feedback";
import { saveAnalysis } from "../services/supaFuncs";
import SuccessToast from "../components/toasts/successToast";
import ErrorToast from "../components/toasts/errorToast";
import { AnalysisPanel, CsvSummaryBar, ExportButton, exportSingleToCsv, exportToCsv, Pagination, ReviewRow, SaveButton, Toolbar } from "../components/resultPageComponents";


const PAGE_SIZE = 25;

const SENTIMENT_ORDER: Record<string, number> = { positive: 0, mixed: 1, negative: 2 };
const URGENCY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as ResultsState | undefined;

    async function onSave() {
        try {
            setSaving(true)
            if (state?.mode === "csv") {
                const result = await saveAnalysis({
                    analysisType: "batch",
                    fileName: state.data.file_name,
                    totalReviews: state.data.total_reviews,
                    results: state.data.results,
                });

                if (!result.success) {
                    setSaving(false)
                    setErrMsg(result.message ?? "Failed to save analysis.");
                    return;
                }

                setSaving(false)
                setMessage("Saved Successfully");

            } else if (state?.mode === "single") {
                setSaving(true)
                const result = await saveAnalysis({
                    analysisType: "single",
                    feedback: state.feedback,
                    results: state.data,
                });


                if (!result.success) {
                    setSaving(false)
                    setErrMsg(result.message ?? "Failed to save analysis.");
                    return;
                }
                setSaving(false);
                setMessage("Saved Successfully");
            }

        } catch (error) {
            setSaving(false)
            setErrMsg("Failed to save analysis.");
        }
    }

    // CSV-mode state
    const [search, setSearch] = useState("");
    const [sentimentFilter, setSentimentFilter] = useState("");
    const [urgencyFilter, setUrgencyFilter] = useState("");
    const [sort, setSort] = useState("index");
    const [page, setPage] = useState(1);
    const [openRows, setOpenRows] = useState<Set<number>>(new Set());
    const [isSaving,setSaving] = useState(false)
    const [message, setMessage] = useState("");
    const [errMsg, setErrMsg] = useState("")

    // Timers for each errMessage
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);


    useEffect(() => {
        if (!errMsg) return;

        const timer = setTimeout(() => {
            setErrMsg("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [errMsg]);

    const toggleRow = useCallback((idx: number) => {
        setOpenRows((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    }, []);

    const allResults = useMemo(
        () => (state?.mode === "csv" ? state.data.results : []),
        [state]
    );

    // Filter
    const filtered = useMemo(() => {
        let r = allResults;
        if (search.trim()) {
            const q = search.toLowerCase();
            r = r.filter((x) => x.review.toLowerCase().includes(q));
        }
        if (sentimentFilter) {
            r = r.filter((x) => x.analysis.sentiment?.toLowerCase() === sentimentFilter);
        }
        if (urgencyFilter) {
            r = r.filter((x) => x.analysis.urgency?.toLowerCase() === urgencyFilter);
        }
        return r;
    }, [allResults, search, sentimentFilter, urgencyFilter]);

    // Sort
    const sorted = useMemo(() => {
        const copy = [...filtered];
        if (sort === "sentiment-asc") copy.sort((a, b) => (SENTIMENT_ORDER[a.analysis.sentiment?.toLowerCase()] ?? 3) - (SENTIMENT_ORDER[b.analysis.sentiment?.toLowerCase()] ?? 3));
        else if (sort === "sentiment-desc") copy.sort((a, b) => (SENTIMENT_ORDER[b.analysis.sentiment?.toLowerCase()] ?? 3) - (SENTIMENT_ORDER[a.analysis.sentiment?.toLowerCase()] ?? 3));
        else if (sort === "urgency-desc") copy.sort((a, b) => (URGENCY_ORDER[a.analysis.urgency?.toLowerCase()] ?? 3) - (URGENCY_ORDER[b.analysis.urgency?.toLowerCase()] ?? 3));
        else if (sort === "urgency-asc") copy.sort((a, b) => (URGENCY_ORDER[b.analysis.urgency?.toLowerCase()] ?? 3) - (URGENCY_ORDER[a.analysis.urgency?.toLowerCase()] ?? 3));
        return copy;
    }, [filtered, sort]);

    // Reset page on filter/sort change
    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleSentiment = (v: string) => { setSentimentFilter(v); setPage(1); };
    const handleUrgency = (v: string) => { setUrgencyFilter(v); setPage(1); };
    const handleSort = (v: string) => { setSort(v); setPage(1); };

    // Paginate
    const paginated = useMemo(
        () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [sorted, page]
    );

    // Empty state
    if (!state) {
        return (
            <div className="rp-wrapper">
                <div className="rp-empty glass-card">
                    <div className="rp-empty-icon">🔍</div>
                    <h2>No results to show</h2>
                    <p>Please submit feedback or upload a CSV to see analysis results.</p>
                    <button className="analyze-btn rp-go-btn" onClick={() => navigate("/")}>
                        <span className="btn-content">Go to Home</span>
                    </button>
                </div>
            </div>
        );
    }

    const isCsv = state.mode === "csv";
    const backpath =
        state.source === "history"
            ? "/history"
            : state.mode === "csv"
                ? "/csv-upload"
                : "/main";



    return (

        <div className="rp-wrapper">
            {
                message && (
                    <SuccessToast Textmessage={message} />
                )}
            
            {
                errMsg && (
                    <ErrorToast Textmessage={errMsg} />
                )}

            {/* Back */}
            <div className="rp-topbar">
                <button id="results-back-btn" className="back-btn" onClick={() => navigate(backpath)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back
                </button>

                {/* Export button */}
                {isCsv && state.mode === "csv" && (<span className="flex flex-row gap-2">
                    {state.source === "history" ? "" : <SaveButton onClick={() => onSave()} saving = {isSaving} />}
                    <ExportButton onClick={() => exportToCsv(state.data.file_name, allResults)} />
                </span>
                )}

                {!isCsv && state.mode === "single" && (
                    <span className="flex flex-row gap-2">
                        {state.source === "history" ? "" : <SaveButton onClick={() => onSave()} saving = {isSaving} />}
                        <ExportButton onClick={() => exportSingleToCsv(state.data)} />
                    </span>

                )}
            </div>

            {/* Header */}
            <header className="app-header">
                <div className="badge">{isCsv ? "Batch Results" : "Analysis Result"}</div>
                <h1>{isCsv ? "CSV Analysis Report" : "Feedback Analysis"}</h1>
                {isCsv && state.mode === "csv" && (
                    <p>
                        <strong style={{ color: "var(--text-primary)" }}>{state.data.file_name}</strong>
                        {" · "}{state.data.total_reviews} review{state.data.total_reviews !== 1 ? "s" : ""} analyzed
                    </p>
                )}
            </header>

            {/* ── CSV mode ── */}
            {isCsv && state.mode === "csv" && (
                <>
                    {/* Clickable summary bar */}
                    <CsvSummaryBar
                        results={allResults}
                        onFilterSentiment={handleSentiment}
                        activeSentiment={sentimentFilter}
                    />

                    {/* Toolbar */}
                    <Toolbar
                        search={search}
                        onSearch={handleSearch}
                        sort={sort}
                        onSort={handleSort}
                        urgency={urgencyFilter}
                        onUrgency={handleUrgency}
                        total={allResults.length}
                        filtered={sorted.length}
                    />

                    {/* Accordion list */}
                    {sorted.length === 0 ? (
                        <div className="rp-no-results glass-card">
                            <span>🔍</span>
                            <p>No reviews match your filters. <button className="rp-clear-link" onClick={() => { setSearch(""); setSentimentFilter(""); setUrgencyFilter(""); }}>Clear filters</button></p>
                        </div>
                    ) : (
                        <>
                            <div className="rp-cards">
                                {paginated.map((item, i) => {
                                    const globalIdx = sorted.indexOf(item);
                                    return (
                                        <ReviewRow
                                            key={globalIdx}
                                            item={item}
                                            index={i}
                                            globalIndex={globalIdx}
                                            isOpen={openRows.has(globalIdx)}
                                            onToggle={() => toggleRow(globalIdx)}
                                        />
                                    );
                                })}
                            </div>
                            <Pagination pageSize={PAGE_SIZE} page={page} total={sorted.length} onChange={setPage} />
                        </>
                    )}
                </>
            )}

            {/*  Single mode */}
            {!isCsv && state.mode === "single" && (
                <div className="rp-panel glass-card">
                    <AnalysisPanel data={state.data} />
                </div>
            )}

            {/* Footer actions */}
            <div className="rp-footer-actions">
                <button className="back-btn rp-action-btn" onClick={() => navigate("/main")}>Analyze Another</button>
                <button className="back-btn rp-action-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                {isCsv && (
                    <button className="back-btn rp-action-btn" onClick={() => navigate("/csv-upload")}>Upload New CSV</button>
                )}
            </div>
        </div>
    );
}

export default ResultsPage;
