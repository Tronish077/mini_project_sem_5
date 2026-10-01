import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import type { FeedbackResponse } from "./types/feedback";
import { analyzeFeedback } from "./services/api";
import LandingPage from "./components/choseAnatype";
import AnalysisForm from "./components/AnalysisForm";
import CsvUploadPage from "./pages/CsvUploadPage";
import ResultsPage from "./pages/ResultsPage";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ProtectedRoute from "./components/protectedRoute";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ResetPasswordPage from "./pages/auth/reset-pass";
import HistoryPage from "./pages/histPage";
import SavedAnalysisPage from "./pages/savedAnalysisPage";
import DashboardPage from "./pages/dashboard";
import EmailConfirmationPage from "./pages/auth/emailConfirmaion";

// ── Single-feedback analysis view ────────────────────────────
function SingleAnalysisView({ onBack }: { onBack: () => void }) {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!feedback.trim()) return;
        try {
            setLoading(true);
            setError("");
            const result: FeedbackResponse = await analyzeFeedback({ feedback });
            navigate("/results", { state: { mode: "single", data: result, feedback: feedback } });
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-wrapper">
            <button className="back-btn" id="back-to-landing-btn" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
            </button>

            <header className="app-header">
                <h1>Feedback Analyzer</h1>
                <p>Instantly extract sentiment, emotions, key topics, and actionable insights from customer feedback.</p>
            </header>

            <AnalysisForm
                feedback={feedback}
                loading={loading}
                onFeedbackChange={setFeedback}
                onAnalyze={handleAnalyze}
            />

            {error && (
                <div className="error-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}

// ── Home (landing → single-analysis) ────────────────────────
function HomeView() {
    const [showForm, setShowForm] = useState(false);

    if (!showForm) {
        return <LandingPage onSingleFeedback={() => setShowForm(true)} />
    }

    return <SingleAnalysisView onBack={() => setShowForm(false)} />
}

// ── Root with router ─────────────────────────────────────────
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* General Endpoints */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/email-sent" element={<EmailConfirmationPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element=
                    {<ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                    }
                />
                <Route path="/main" element=
                    {<ProtectedRoute >
                        <HomeView />
                    </ProtectedRoute>
                    }
                />
                <Route path="/csv-upload" element={
                    <ProtectedRoute>
                        <CsvUploadPage />
                    </ProtectedRoute>
                } />
                <Route path="/results" element={
                    <ProtectedRoute>
                        <ResultsPage />
                    </ProtectedRoute>
                } />
                <Route path="/history" element=
                    {<ProtectedRoute>
                        <HistoryPage />
                    </ProtectedRoute>
                    } />
                <Route path="/history/:id" element=
                    {<ProtectedRoute>
                        <SavedAnalysisPage />
                    </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;