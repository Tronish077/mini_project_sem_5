import type { FeedbackResponse } from "../types/feedback";

type AnalysisCardProps = {
    result: FeedbackResponse;
};

function getSentimentClass(val: string): string {
    const v = val?.toLowerCase();
    if (v === "positive") return "positive";
    if (v === "negative") return "negative";
    return "neutral";
}

function getUrgencyClass(val: string): string {
    const v = val?.toLowerCase();
    if (v === "high") return "high";
    if (v === "low") return "low";
    return "medium";
}

function AnalysisCard({ result }: AnalysisCardProps) {
    return (
        <div className="glass-card result-card">
            {/* Header */}
            <div className="card-header">
                <div className="header-icon">✦</div>
                <h2>Analysis Result</h2>
            </div>

            {/* Metrics Row */}
            <div className="metrics-grid">
                <div className={`metric-chip ${getSentimentClass(result.sentiment)}`}>
                    <div className="metric-label">Sentiment</div>
                    <div className="metric-value">{result.sentiment}</div>
                </div>
                <div className="metric-chip">
                    <div className="metric-label">Emotion</div>
                    <div className="metric-value">{result.emotion}</div>
                </div>
                <div className={`metric-chip ${getUrgencyClass(result.urgency)}`}>
                    <div className="metric-label">Urgency</div>
                    <div className="metric-value">{result.urgency}</div>
                </div>
            </div>

            {/* Topics */}
            <div className="topics-grid">
                <div className="topic-section positive">
                    <h3>✓ Positive Topics</h3>
                    <div className="topic-tags">
                        {result.positive_topics?.length > 0 ? (
                            result.positive_topics.map((topic) => (
                                <span key={topic} className="topic-tag">{topic}</span>
                            ))
                        ) : (
                            <span className="topic-empty">None identified</span>
                        )}
                    </div>
                </div>
                <div className="topic-section negative">
                    <h3>✗ Negative Topics</h3>
                    <div className="topic-tags">
                        {result.negative_topics?.length > 0 ? (
                            result.negative_topics.map((topic) => (
                                <span key={topic} className="topic-tag">{topic}</span>
                            ))
                        ) : (
                            <span className="topic-empty">None identified</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Text Sections */}
            <div className="text-section">
                <div className="section-title">Business Impact</div>
                <p>{result.business_impact}</p>
            </div>

            <div className="text-section">
                <div className="section-title">Summary</div>
                <p>{result.summary ?? result.business_impact}</p>
            </div>

            <div className="text-section">
                <div className="section-title">Recommendation</div>
                <p>{result.recommendation}</p>
            </div>
        </div>
    );
}

export default AnalysisCard;