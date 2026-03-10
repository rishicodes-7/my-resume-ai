"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingText, setLoadingText] = useState(0);
  const [mounted, setMounted] = useState(false);

  const loadingMessages = [
    "Reading your resume...",
    "Scanning job requirements...",
    "Matching keywords...",
    "Identifying skill gaps...",
    "Generating insights...",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingText((prev) => (prev + 1) % loadingMessages.length);
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const analyze = async () => {
    setLoading(true);
    setStep(3);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription: jobDesc }),
      });
      const data = await res.json();
      if (data.error) {
        alert("API Error: " + data.error);
        setStep(2);
        setLoading(false);
        return;
      }
      setResult(data);
      setLoading(false);
    } catch (err) {
      alert("Something went wrong: " + err.message);
      setStep(2);
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setResult(null);
    setResume("");
    setJobDesc("");
    setActiveTab("overview");
  };

  const scoreColor = result
    ? result.score >= 75 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444"
    : "#10b981";

  const scoreLabel = result
    ? result.score >= 75 ? "Strong Match" : result.score >= 50 ? "Decent Match" : "Weak Match"
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080b0f;
          color: #e8eaed;
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
        }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, #0d2818 0%, transparent 70%),
                      radial-gradient(ellipse 60% 40% at 80% 80%, #0a1f10 0%, transparent 60%);
        }

        .wrap { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; padding: 0 24px 80px; }

        /* HEADER */
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 0 0;
          border-bottom: 1px solid #ffffff08;
          margin-bottom: 72px;
        }
        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 3px;
          color: #fff;
        }
        .logo span { color: #10b981; }
        .badge {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #10b981;
          border: 1px solid #10b98130; border-radius: 20px;
          padding: 5px 14px; background: #10b98108;
        }

        /* HERO */
        .hero { margin-bottom: 56px; }
        .hero-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 3px;
          text-transform: uppercase; color: #10b981;
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }
        .hero-eyebrow::before {
          content: ''; display: block; width: 24px; height: 1px; background: #10b981;
        }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 9vw, 88px);
          line-height: 0.95; letter-spacing: 2px;
          color: #fff; margin-bottom: 20px;
        }
        .hero-title em { color: #10b981; font-style: normal; }
        .hero-sub {
          font-size: 16px; color: #6b7280; line-height: 1.7;
          max-width: 460px; font-weight: 300;
        }

        /* STEPPER */
        .stepper {
          display: flex; align-items: center; gap: 0;
          margin-bottom: 48px;
        }
        .step-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; padding: 10px 0;
          transition: color 0.3s;
        }
        .step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
          transition: all 0.3s;
        }
        .step-line { flex: 1; height: 1px; background: #1a1f27; margin: 0 16px; }

        /* CARD */
        .card {
          background: #0d1117;
          border: 1px solid #1a2030;
          border-radius: 16px; padding: 32px;
          margin-bottom: 20px;
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .field-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #4b5563;
          margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
        }
        .field-label::after { content: ''; flex: 1; height: 1px; background: #1a2030; }

        textarea {
          width: 100%; background: #080b0f;
          border: 1px solid #1a2030; border-radius: 10px;
          padding: 16px; color: #e8eaed; font-size: 14px;
          font-family: 'Outfit', sans-serif; font-weight: 300;
          resize: vertical; outline: none; min-height: 160px;
          transition: border-color 0.2s; line-height: 1.7;
        }
        textarea:focus { border-color: #10b98140; }
        textarea::placeholder { color: #2d3748; }

        /* BUTTONS */
        .btn-primary {
          width: 100%; padding: 16px;
          background: #10b981; color: #080b0f;
          border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s; display: flex;
          align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover { background: #0d9e6e; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

        .btn-ghost {
          padding: 14px 24px; background: transparent;
          color: #4b5563; border: 1px solid #1a2030;
          border-radius: 10px; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.5px;
        }
        .btn-ghost:hover { border-color: #2d3748; color: #9ca3af; }

        .btn-row { display: flex; gap: 12px; }
        .btn-row .btn-primary { flex: 1; }

        /* LOADING */
        .loading-wrap { padding: 60px 32px; text-align: center; }
        .loader {
          width: 56px; height: 56px; margin: 0 auto 28px;
          border-radius: 50%;
          border: 2px solid #1a2030;
          border-top-color: #10b981;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 2px; color: #fff;
          margin-bottom: 8px;
        }
        .loading-sub { color: #4b5563; font-size: 14px; font-weight: 300;
          min-height: 22px; transition: opacity 0.3s; }

        /* SCORE SECTION */
        .score-card {
          display: grid; grid-template-columns: auto 1fr;
          gap: 40px; align-items: center;
        }
        @media (max-width: 500px) { .score-card { grid-template-columns: 1fr; text-align: center; } }
        .score-ring-wrap { position: relative; width: 130px; height: 130px; flex-shrink: 0; }
        .score-ring-wrap svg { transform: rotate(-90deg); }
        .score-text {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); text-align: center;
        }
        .score-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px; line-height: 1; letter-spacing: 1px;
        }
        .score-denom { font-size: 11px; color: #4b5563; letter-spacing: 1px; font-weight: 500; }
        .score-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px; letter-spacing: 2px; color: #fff;
          margin-bottom: 8px; line-height: 1;
        }
        .score-desc { font-size: 14px; color: #6b7280; line-height: 1.7; font-weight: 300; }

        /* TABS */
        .tabs { display: flex; gap: 2px; margin-bottom: 28px; background: #080b0f; border-radius: 10px; padding: 4px; }
        .tab-btn {
          flex: 1; padding: 10px; font-family: 'Outfit', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; border: none; border-radius: 8px;
          cursor: pointer; transition: all 0.2s;
        }

        /* LIST ITEMS */
        .result-list { display: flex; flex-direction: column; gap: 2px; }
        .result-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 16px; border-radius: 8px;
          background: #080b0f; font-size: 14px;
          color: #9ca3af; line-height: 1.6; font-weight: 300;
          transition: background 0.15s;
        }
        .result-item:hover { background: #0d1117; }
        .result-dot {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0; margin-top: 7px;
        }

        /* KEYWORDS */
        .keyword-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .kw-tag {
          padding: 6px 14px; border-radius: 20px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
        }
        .kw-matched { background: #10b98112; color: #10b981; border: 1px solid #10b98125; }
        .kw-missing { background: #ef444412; color: #f87171; border: 1px solid #ef444425; }

        /* REWRITE */
        .rewrite-box {
          background: #080b0f; border-left: 2px solid #10b981;
          border-radius: 8px; padding: 20px 24px;
          font-size: 14px; color: #9ca3af; line-height: 1.9;
          font-weight: 300; font-style: italic;
        }

        .section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: #1a2030; }

        .char-count { font-size: 12px; color: #2d3748; text-align: right; margin-top: 8px; }
      `}</style>

      <div className="grain" />
      <div className="bg-glow" />

      <div className="wrap">
        {/* Header */}
        <header className="header">
          <div className="logo">RESUME<span>AI</span></div>
          <div className="badge">Powered by LLaMA 3.3</div>
        </header>

        {/* Hero - only show on step 1 */}
        {step === 1 && (
          <div className="hero">
            <div className="hero-eyebrow">AI Resume Analysis</div>
            <h1 className="hero-title">
              GET YOUR<br />
              RESUME <em>SCORED</em><br />
              INSTANTLY
            </h1>
            <p className="hero-sub">
              Paste your resume and a job description. Our AI analyzes the match, finds gaps, and rewrites your summary.
            </p>
          </div>
        )}

        {/* Stepper */}
        <div className="stepper">
          {[
            { n: 1, label: "Resume" },
            { n: 2, label: "Job Post" },
            { n: 3, label: "Results" },
          ].map((s, i) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div className="step-item" style={{ color: done ? "#10b981" : active ? "#fff" : "#2d3748" }}>
                  <div className="step-num" style={{
                    background: done ? "#10b98120" : active ? "#10b981" : "#0d1117",
                    color: done ? "#10b981" : active ? "#080b0f" : "#2d3748",
                    border: done ? "1px solid #10b98130" : active ? "none" : "1px solid #1a2030",
                  }}>
                    {done ? "✓" : s.n}
                  </div>
                  {s.label}
                </div>
                {i < 2 && <div className="step-line" />}
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="card">
            <div className="field-label">Your Resume</div>
            <textarea
              placeholder="Paste your full resume here — work experience, skills, education..."
              value={resume}
              onChange={e => setResume(e.target.value)}
              rows={8}
            />
            <div className="char-count">{resume.length} characters</div>
            <div style={{ marginTop: 20 }}>
              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={resume.trim().length < 20}
              >
                Continue to Job Description →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="card">
            <div className="field-label">Job Description</div>
            <textarea
              placeholder="Paste the job posting you want to apply for..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              rows={8}
            />
            <div className="char-count">{jobDesc.length} characters</div>
            <div style={{ marginTop: 20 }} className="btn-row">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn-primary"
                onClick={analyze}
                disabled={jobDesc.trim().length < 20}
              >
                Analyze with AI ✦
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - Loading */}
        {step === 3 && loading && (
          <div className="card">
            <div className="loading-wrap">
              <div className="loader" />
              <div className="loading-title">ANALYZING</div>
              <div className="loading-sub">{loadingMessages[loadingText]}</div>
            </div>
          </div>
        )}

        {/* STEP 3 - Results */}
        {step === 3 && result && (
          <>
            {/* Score */}
            <div className="card">
              <div className="score-card">
                <div className="score-ring-wrap">
                  <svg width="130" height="130" viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r="54" fill="none" stroke="#1a2030" strokeWidth="10" />
                    <circle
                      cx="65" cy="65" r="54" fill="none"
                      stroke={scoreColor} strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - result.score / 100)}`}
                      style={{ transition: "stroke-dashoffset 1.2s ease" }}
                    />
                  </svg>
                  <div className="score-text">
                    <div className="score-num" style={{ color: scoreColor }}>{result.score}</div>
                    <div className="score-denom">/ 100</div>
                  </div>
                </div>
                <div>
                  <div className="score-label" style={{ color: scoreColor }}>{scoreLabel}</div>
                  <p className="score-desc">
                    Your resume has been analyzed against the job requirements. See the breakdown below for detailed insights and recommendations.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="tabs">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "keywords", label: "Keywords" },
                  { id: "rewrite", label: "Rewrite" },
                ].map(t => (
                  <button
                    key={t.id}
                    className="tab-btn"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      background: activeTab === t.id ? "#0d1117" : "transparent",
                      color: activeTab === t.id ? "#fff" : "#4b5563",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div>
                  <div className="section-label" style={{ color: "#10b981" }}>Strengths</div>
                  <div className="result-list" style={{ marginBottom: 28 }}>
                    {result.strengths?.map((s, i) => (
                      <div key={i} className="result-item">
                        <div className="result-dot" style={{ background: "#10b981" }} />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="section-label" style={{ color: "#f87171" }}>Gaps to Address</div>
                  <div className="result-list">
                    {result.gaps?.map((g, i) => (
                      <div key={i} className="result-item">
                        <div className="result-dot" style={{ background: "#f87171" }} />
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "keywords" && (
                <div>
                  <div className="section-label" style={{ color: "#10b981" }}>Matched Keywords</div>
                  <div className="keyword-grid" style={{ marginBottom: 28 }}>
                    {result.matchedKeywords?.map(k => (
                      <span key={k} className="kw-tag kw-matched">{k}</span>
                    ))}
                  </div>
                  <div className="section-label" style={{ color: "#f87171" }}>Missing Keywords</div>
                  <div className="keyword-grid">
                    {result.missingKeywords?.map(k => (
                      <span key={k} className="kw-tag kw-missing">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "rewrite" && (
                <div>
                  <div className="section-label" style={{ color: "#10b981" }}>AI Rewritten Summary</div>
                  <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16, lineHeight: 1.7, fontWeight: 300 }}>
                    A tailored professional summary optimized for this specific role:
                  </p>
                  <div className="rewrite-box">"{result.rewrittenSummary}"</div>
                  <button
                    style={{ marginTop: 16, fontSize: 13, color: "#10b981", background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}
                    onClick={() => navigator.clipboard.writeText(result.rewrittenSummary)}
                  >
                    Copy to clipboard ↗
                  </button>
                </div>
              )}
            </div>

            <button className="btn-ghost" style={{ width: "100%" }} onClick={reset}>
              ← Analyze Another Resume
            </button>
          </>
        )}
      </div>
    </>
  );
}