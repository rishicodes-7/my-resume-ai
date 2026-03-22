"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputMode, setInputMode] = useState("paste");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const analyze = async () => {
    setLoading(true);
    setStep(3);

    try {
      let res;

      if (inputMode === "upload" && uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("jobDescription", jobDesc);
        res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume, jobDescription: jobDesc }),
        });
      }

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        setStep(2);
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (err) {
      alert("Something went wrong: " + err.message);
      setStep(2);
    }

    setLoading(false);
  };

  const reset = () => {
    setStep(1);
    setResult(null);
    setResume("");
    setJobDesc("");
    setUploadedFile(null);
    setInputMode("paste");
  };

  const canContinue =
    inputMode === "upload" ? !!uploadedFile : resume.length >= 20;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; }

        .wrap {
          min-height: 100vh;
          background: #080810;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          padding: clamp(24px, 5vw, 60px) clamp(16px, 5vw, 40px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header { text-align: center; margin-bottom: clamp(32px, 5vw, 56px); }
        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 6vw, 3.2rem);
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tagline {
          font-size: clamp(0.6rem, 2vw, 0.72rem);
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 8px;
        }

        .stepper {
          display: flex;
          align-items: center;
          margin-bottom: clamp(28px, 4vw, 48px);
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
        .step-item.active { color: #a855f7; }
        .step-item.done { color: rgba(168,85,247,0.5); }
        .step-num {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 1px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem;
          flex-shrink: 0;
        }
        .step-item.active .step-num { background: #a855f7; border-color: #a855f7; color: #fff; }
        .step-item.done .step-num { background: rgba(168,85,247,0.2); }
        .step-line {
          width: clamp(24px, 6vw, 60px);
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 0 8px;
        }

        .card {
          width: 100%;
          max-width: 640px;
          background: #0f0f1a;
          border: 1px solid rgba(168,85,247,0.15);
          padding: clamp(24px, 4vw, 40px);
        }

        .card-label {
          font-size: 0.6rem;
          color: rgba(168,85,247,0.7);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }

        .mode-toggle {
          display: flex;
          margin-bottom: 20px;
          border: 1px solid rgba(168,85,247,0.15);
          overflow: hidden;
        }
        .mode-btn {
          flex: 1;
          padding: 10px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mode-btn.active { background: rgba(168,85,247,0.15); color: #a855f7; }

        .textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          padding: 16px;
          resize: none;
          outline: none;
          height: 200px;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        .textarea:focus { border-color: rgba(168,85,247,0.4); }
        .textarea::placeholder { color: rgba(255,255,255,0.15); }

        .dropzone {
          border: 1px dashed rgba(168,85,247,0.3);
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(168,85,247,0.02);
        }
        .dropzone:hover, .dropzone.over { border-color: rgba(168,85,247,0.6); background: rgba(168,85,247,0.06); }
        .dropzone.has-file { border-color: rgba(168,85,247,0.5); background: rgba(168,85,247,0.05); }
        .drop-icon { font-size: 2rem; margin-bottom: 12px; opacity: 0.6; }
        .drop-title { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
        .drop-sub { font-size: 0.62rem; color: rgba(255,255,255,0.25); letter-spacing: 0.08em; }
        .file-name { font-size: 0.72rem; color: #a855f7; margin-top: 10px; word-break: break-all; }

        .char-count { font-size: 0.58rem; color: rgba(255,255,255,0.2); text-align: right; margin-top: 6px; }

        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px;
          border: none;
          cursor: pointer;
          margin-top: 20px;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-row { display: flex; gap: 12px; margin-top: 20px; }
        .btn-back {
          padding: 16px 24px;
          background: none;
          border: 1px solid rgba(168,85,247,0.3);
          color: rgba(168,85,247,0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .btn-back:hover { border-color: #a855f7; color: #a855f7; }

        .loading-wrap { text-align: center; padding: 60px 0; }
        .spinner {
          width: 48px; height: 48px;
          border: 2px solid rgba(168,85,247,0.15);
          border-top-color: #a855f7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { font-size: 0.72rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }

        .score-card {
          background: rgba(168,85,247,0.06);
          border: 1px solid rgba(168,85,247,0.2);
          padding: 32px;
          text-align: center;
          margin-bottom: 16px;
        }
        .score-num {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4rem, 15vw, 6rem);
          font-weight: 800;
          color: #a855f7;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .score-label { font-size: 0.6rem; color: rgba(255,255,255,0.25); letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px; }
        .score-bar-wrap { margin-top: 20px; background: rgba(255,255,255,0.05); height: 4px; }
        .score-bar { height: 4px; background: linear-gradient(90deg, #7c3aed, #a855f7); transition: width 1s ease; }

        .result-section {
          background: #0f0f1a;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 24px;
          margin-bottom: 12px;
        }
        .result-title {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .result-title.green { color: #4ade80; }
        .result-title.red { color: #f87171; }
        .result-title.blue { color: #60a5fa; }
        .result-title.yellow { color: #fbbf24; }

        .result-item {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 8px;
          padding-left: 16px;
          position: relative;
        }
        .result-item::before { content: '—'; position: absolute; left: 0; color: rgba(255,255,255,0.2); }

        .keywords-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .keyword { font-size: 0.62rem; padding: 4px 10px; border: 1px solid; letter-spacing: 0.06em; }
        .keyword.match { color: #4ade80; border-color: rgba(74,222,128,0.25); background: rgba(74,222,128,0.05); }
        .keyword.miss { color: #f87171; border-color: rgba(248,113,113,0.25); background: rgba(248,113,113,0.05); }

        .rewrite-text {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.8;
          font-style: italic;
          border-left: 2px solid rgba(96,165,250,0.4);
          padding-left: 16px;
        }
        .copy-btn {
          margin-top: 12px;
          padding: 8px 16px;
          background: none;
          border: 1px solid rgba(96,165,250,0.3);
          color: rgba(96,165,250,0.7);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-btn:hover { border-color: #60a5fa; color: #60a5fa; }

        .btn-reset {
          width: 100%;
          padding: 14px;
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.25);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.2s;
        }
        .btn-reset:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="logo">ResumeAI</div>
          <div className="tagline">Paste or upload your resume · Get an AI match score instantly</div>
        </div>

        <div className="stepper">
          {["Resume", "Job Desc", "Results"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div className={`step-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
                <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < 2 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="card">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <span className="card-label">Step 1 — Your Resume</span>
              <div className="mode-toggle">
                <button className={`mode-btn ${inputMode === "paste" ? "active" : ""}`} onClick={() => setInputMode("paste")}>✎ Paste Text</button>
                <button className={`mode-btn ${inputMode === "upload" ? "active" : ""}`} onClick={() => setInputMode("upload")}>↑ Upload PDF</button>
              </div>

              {inputMode === "paste" ? (
                <>
                  <textarea className="textarea" placeholder="Paste your resume text here..." value={resume} onChange={e => setResume(e.target.value)} />
                  <div className="char-count">{resume.length} chars</div>
                </>
              ) : (
                <>
                  <input type="file" accept=".pdf" ref={fileInputRef} style={{ display: "none" }} onChange={e => handleFileChange(e.target.files[0])} />
                  <div
                    className={`dropzone ${dragOver ? "over" : ""} ${uploadedFile ? "has-file" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
                  >
                    <div className="drop-icon">{uploadedFile ? "✓" : "⬆"}</div>
                    <div className="drop-title">{uploadedFile ? "PDF Uploaded!" : "Drop your PDF here"}</div>
                    <div className="drop-sub">{uploadedFile ? "" : "or click to browse"}</div>
                    {uploadedFile && <div className="file-name">{uploadedFile.name}</div>}
                  </div>
                </>
              )}

              <button className="btn-primary" onClick={() => setStep(2)} disabled={!canContinue}>Continue →</button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <span className="card-label">Step 2 — Job Description</span>
              <textarea className="textarea" placeholder="Paste the job description here..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} autoFocus />
              <div className="char-count">{jobDesc.length} chars</div>
              <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" style={{ marginTop: 0 }} onClick={analyze} disabled={jobDesc.length < 20}>🤖 Analyze Now</button>
              </div>
            </>
          )}

          {/* LOADING */}
          {step === 3 && loading && (
            <div className="loading-wrap">
              <div className="spinner" />
              <div className="loading-text">AI is analyzing your resume...</div>
            </div>
          )}

          {/* RESULTS */}
          {step === 3 && result && !loading && (
            <>
              <div className="score-card">
                <div className="score-num">{result.score}</div>
                <div className="score-label">Match Score / 100</div>
                <div className="score-bar-wrap">
                  <div className="score-bar" style={{ width: `${result.score}%` }} />
                </div>
              </div>

              <div className="result-section">
                <div className="result-title green">✅ Strengths</div>
                {result.strengths?.map((s, i) => <div key={i} className="result-item">{s}</div>)}
              </div>

              <div className="result-section">
                <div className="result-title red">⚠ Gaps</div>
                {result.gaps?.map((g, i) => <div key={i} className="result-item">{g}</div>)}
              </div>

              <div className="result-section">
                <div className="result-title yellow">◎ Keywords</div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", marginBottom: 8, letterSpacing: "0.1em" }}>MATCHED</div>
                  <div className="keywords-wrap">
                    {result.matchedKeywords?.map((k, i) => <span key={i} className="keyword match">{k}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", marginBottom: 8, letterSpacing: "0.1em" }}>MISSING</div>
                  <div className="keywords-wrap">
                    {result.missingKeywords?.map((k, i) => <span key={i} className="keyword miss">{k}</span>)}
                  </div>
                </div>
              </div>

              <div className="result-section">
                <div className="result-title blue">✍ Rewritten Summary</div>
                <div className="rewrite-text">{result.rewrittenSummary}</div>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.rewrittenSummary)}>Copy Summary</button>
              </div>

              <button className="btn-reset" onClick={reset}>← Analyze Another</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}