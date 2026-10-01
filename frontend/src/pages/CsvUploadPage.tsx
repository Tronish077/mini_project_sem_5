import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCsvFeedback } from "../services/api";

type UploadState = "idle" | "dragging" | "selected" | "uploading" | "error";

function CsvUploadPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleFile = (file: File) => {
        if (!file.name.endsWith(".csv")) {
            setErrorMsg("Please upload a valid .csv file.");
            setUploadState("error");
            return;
        }
        setErrorMsg("");
        setSelectedFile(file);
        setUploadState("selected");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setUploadState("idle");
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        try {
            setUploadState("uploading");
            const result = await uploadCsvFeedback(selectedFile);
            navigate("/results", { state: { mode: "csv", data: result } });
        } catch (err) {
            console.error(err);
            setErrorMsg("Upload failed. Please check your file and try again.");
            setUploadState("error");
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setUploadState("idle");
        setErrorMsg("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="csv-page-wrapper">
            {/* Back button */}
            <button className="back-btn" id="back-btn" onClick={() => navigate("/main")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
            </button>

            {/* Header */}
            <header className="app-header">
                <h1>CSV Feedback Upload</h1>
                <p>Upload a CSV file with a <code className="csv-code">feedback</code> column to analyze hundreds of entries at once.</p>
            </header>

            {/* Drop zone */}
            <div
                id="csv-dropzone"
                className={[
                    "csv-dropzone glass-card",
                    uploadState === "dragging" ? "dragging" : "",
                    uploadState === "error" ? "drop-error" : "",
                    uploadState === "selected" ? "has-file" : "",
                ].join(" ")}
                onDragOver={(e) => { e.preventDefault(); setUploadState("dragging"); }}
                onDragLeave={() => setUploadState(selectedFile ? "selected" : "idle")}
                onDrop={handleDrop}
                onClick={() => uploadState !== "uploading" && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    id="csv-file-input"
                    className="csv-hidden-input"
                    onChange={handleInputChange}
                />

                {uploadState === "idle" || uploadState === "dragging" ? (
                    <div className="drop-content">
                        <div className="drop-icon-ring">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <p className="drop-title">{uploadState === "dragging" ? "Drop it here!" : "Drag & drop your CSV"}</p>
                        <p className="drop-sub">or <span className="drop-link">browse files</span></p>
                        <p className="drop-hint">Supports .csv files · max 10MB</p>
                    </div>
                ) : uploadState === "error" ? (
                    <div className="drop-content">
                        <div className="drop-icon-ring error-ring">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p className="drop-title error-text">{errorMsg}</p>
                        <button className="drop-retry" onClick={(e) => { e.stopPropagation(); reset(); }}>Try again</button>
                    </div>
                ) : uploadState === "uploading" ? (
                    <div className="drop-content">
                        <div className="drop-icon-ring uploading-ring">
                            <span className="spinner spinner-lg" />
                        </div>
                        <p className="drop-title">Analyzing your data…</p>
                        <p className="drop-sub">This may take a moment</p>
                    </div>
                ) : (
                    /* selected */
                    <div className="drop-content file-selected-content" onClick={(e) => e.stopPropagation()}>
                        <div className="drop-icon-ring file-ring">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <p className="drop-title">{selectedFile?.name}</p>
                        <p className="drop-sub">{selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB · CSV ready</p>
                        <button className="drop-retry" onClick={(e) => { e.stopPropagation(); reset(); }}>Remove</button>
                    </div>
                )}
            </div>

            {/* Analyze button */}
            {uploadState === "selected" && (
                <button
                    id="csv-analyze-btn"
                    className="analyze-btn csv-analyze-btn"
                    onClick={handleAnalyze}
                >
                    <span className="btn-content">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        Analyze CSV Data
                    </span>
                </button>
            )}

            {/* Format guide */}
            <div className="csv-guide glass-card">
                <h3 className="csv-guide-title">📋 Expected CSV Format</h3>
                <div className="csv-preview">
                    <div className="csv-row csv-header-row">
                        <span>feedback</span>
                        <span>date</span>
                        <span>user_id</span>
                    </div>
                    <div className="csv-row">
                        <span>"Great product, love it!"</span>
                        <span>2024-01-01</span>
                        <span>user_001</span>
                    </div>
                    <div className="csv-row">
                        <span>"Delivery was slow…"</span>
                        <span>2024-01-02</span>
                        <span>user_002</span>
                    </div>
                </div>
                <p className="csv-guide-note">Only the <code className="csv-code">feedback</code> column is required. Additional columns are preserved in the output.</p>
            </div>
        </div>
    );
}

export default CsvUploadPage;
