type AnalysisFormProps = {
    feedback: string;
    loading: boolean;
    onFeedbackChange: (value: string) => void;
    onAnalyze: () => void;
};

function AnalysisForm({
    feedback,
    loading,
    onFeedbackChange,
    onAnalyze,
}: AnalysisFormProps) {
    return (
        <div className="glass-card">
            <label className="form-label" htmlFor="feedback-input">
                Customer Feedback
            </label>
            <textarea
                id="feedback-input"
                className="form-textarea"
                rows={8}
                placeholder="Paste customer feedback here — reviews, support tickets, survey responses..."
                value={feedback}
                onChange={(e) => onFeedbackChange(e.target.value)}
            />
            <div className="char-count">{feedback.length} characters</div>

            <button
                className="analyze-btn"
                disabled={loading || !feedback.trim()}
                onClick={onAnalyze}
            >
                <span className="btn-content">
                    {loading ? (
                        <>
                            <span className="spinner" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                                <path d="M11 8v6M8 11h6" />
                            </svg>
                            Analyze Feedback
                        </>
                    )}
                </span>
            </button>
        </div>
    );
}

export default AnalysisForm;