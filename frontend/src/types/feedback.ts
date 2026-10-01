export interface FeedbackRequest {
    feedback: string;
}

export interface FeedbackResponse {
    sentiment: string;
    summary: string;
    positive_topics: string[];
    negative_topics: string[];
    emotion: string;
    urgency: string;
    recommendation: string;
    business_impact: string;
}

// CSV Upload types
export interface CsvReviewResult {
    review: string;
    analysis: FeedbackResponse;
}

export interface CsvUploadResponse {
    file_name: string;
    total_reviews: number;
    results: CsvReviewResult[];
}

// Result state passed via the router
export type ResultsState =
    | { mode: "single"; data: FeedbackResponse; feedback: string; source: string }
    | { mode: "csv"; data: CsvUploadResponse; source: string };

export interface SavedAnalysis {
    id: string;
    user_id: string;
    analysis_type: "single" | "batch";
    feedback: string | null;
    file_name: string | null;
    total_reviews: number | null;
    results: unknown;
    created_at: string;
}

//  Dashboard stats
export interface DashboardStats {
    total_reviews: number;

    sentiment: {
        positive: number;
        negative: number;
        neutral: number;
        mixed: number;
    };

    urgency: {
        high: number;
        medium: number;
        low: number;
    };

    emotions: Record<string, number>;

    business_impact: Record<string, number>;
}