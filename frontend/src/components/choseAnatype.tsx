import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  onSingleFeedback: () => void;
}

function LandingPage({ onSingleFeedback }: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="w-1/2 p-10">      
      <button 
      className="back-btn rounded-xl" 
      id="back-btn" 
      onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
      </button>
      <div className="min-h-screen flex justify-center">
      <section className="w-full max-w-2xl flex flex-col gap-8 items-center px-6 py-8">

          <span className="flex flex-col text-center">
            <h1 className="font-bold text-4xl">
              How would you like to analyze ?
            </h1>

            <p className="text-zinc-500">
              Choose an option to get started with your customer feedback.
            </p>
          </span>
    

          {/* CTA Buttons */}
          <div className="landing-cta-group">
            {/* Single sentence */}
            <button
              id="single-feedback-btn"
              className="landing-btn landing-btn-primary"
              onClick={onSingleFeedback}
            >
              <span className="landing-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="landing-btn-text">
                <span className="landing-btn-label">Analyze Single Feedback</span>
                <span className="landing-btn-sub">Paste one review or sentence</span>
              </span>
              <span className="landing-btn-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            {/* CSV batch upload */}
            <button
              id="csv-upload-btn"
              className="landing-btn landing-btn-secondary"
              onClick={() => navigate("/csv-upload")}
            >
              <span className="landing-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </span>
              <span className="landing-btn-text">
                <span className="landing-btn-label">Batch CSV Analysis</span>
                <span className="landing-btn-sub">Upload hundreds of rows at once</span>
              </span>
              <span className="landing-btn-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </section>

      </div>
    </div>

  );
}

export default LandingPage;
