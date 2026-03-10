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

  const loadingMessages = [
    "Reading your resume...",
    "Scanning job requirements...",
    "Matching keywords...",
    "Identifying skill gaps...",
    "Generating insights...",
  ];

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

  const scoreColor =
    result
      ? result.score >= 75 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444"
      : "#10b981";

  const scoreLabel =
    result
      ? result.score >= 75 ? "Strong Match" : result.score >= 50 ? "Decent Match" : "Weak Match"
      : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { font-size: 16px; }

        body {
          background: #080b0f;
          color: #e8eaed;
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          -webkit-text-size-adjust: 100%;
        }

        /* ── GRAIN + GLOW ── */
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        .bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, #0d2818 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, #0a1f10 0%, transparent 60%);
        }

        /* ── LAYOUT ── */
        .wrap {
          position: relative; z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          padding: 0 16px 80px;
        }

        /* ── HEADER ── */
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0 20px;
          border-bottom: 1px solid #ffffff08;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(20px, 4vw, 26px);
          letter-spacing: 3px; color: #fff;
        }
        .logo span { color: #10b981; }
        .badge {
          font-size: clamp(9px, 2vw, 11px); font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #10b981;
          border: 1px solid #10b98130; border-radius: 20px;
          padding: 5px 12px; background: #10b98108;
          white-space: nowrap;
        }

        /* ── HERO ── */
        .hero { margin-bottom: 44px; }
        .hero-eyebrow {
          font-size: clamp(9px, 2vw, 11px); font-weight: 600; letter-spacing: 3px;
          text-transform: uppercase; color: #10b981;
          margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
        }
        .hero-eyebrow::before { content: ''; display: block; width: 20px; height: 1px; background: #10b981; }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 10vw, 88px);
          line-height: 0.95; letter-spacing: 2px;
          color: #fff; margin-bottom: 16px;
        }
        .hero-title em { color: #10b981; font-style: normal; }
        .hero-sub {
          font-size: clamp(14px, 2.5vw, 16px);
          color: #6b7280; line-height: 1.7;
          max-width: 460px; font-weight: 300;
        }

        /* ── STEPPER ── */
        .stepper {
          display: flex; align-items: center;
          margin-bottom: 32px; overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .stepper::-webkit-scrollbar { display: none; }
        .step-item {
          display: flex; align-items: center; gap: 8px;
          font-size: clamp(10px, 2vw, 12px); font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; white-space: nowrap;
          transition: color 0.3s;
        }
        .step-num {
          width: clamp(24px, 4vw, 28px); height: clamp(24px, 4vw, 28px);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: clamp(10px, 2vw, 12px); font-weight: 700; flex-shrink: 0;
          transition: all 0.3s;
        }
        .step-line { flex: 1; height: 1px; background: #1a2030; margin: 0 12px; min-width: 20px; }

        /* ── CARD ── */
        .card {
          background: #0d1117;
          border: 1px solid #1a2030;
          border-radius: 14px;
          padding: clamp(20px, 4vw, 32px);
          margin-bottom: 16px;
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-label {
          font-size: clamp(9px, 2vw, 11px); font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #4b5563;
          margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
        }
        .field-label::after { content: ''; flex: 1; height: 1px; background: #1a2030; }

        textarea {
          width: 100%; background: #080b0f;
          border: 1px solid #1a2030; border-radius: 10px;
          padding: clamp(12px, 3vw, 16px);
          color: #e8eaed; font-size: clamp(13px, 2vw, 14px);
          font-family: 'Outfit', sans-serif; font-weight: 300;
          resize: vertical; outline: none;
          min-height: clamp(130px, 25vw, 170px);
          transition: border-color 0.2s; line-height: 1.7;
        }
        textarea:focus { border-color: #10b98140; }
        textarea::placeholder { color: #2d3748; }

        .char-count { font-size: 12px; color: #2d3748; text-align: right; margin-top: 6px; }

        /* ── BUTTONS ── */
        .btn-primary {
          width: 100%; padding: clamp(13px, 3vw, 16px);
          background: #10b981; color: #080b0f;
          border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: clamp(12px, 2.5vw, 14px); font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:hover { background: #0d9e6e; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

        .btn-ghost {
          padding: clamp(11px, 2.5vw, 14px) clamp(16px, 3vw, 24px);
          background: transparent; color: #4b5563;
          border: 1px solid #1a2030; border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: clamp(12px, 2.5vw, 13px); font-weight: 600; cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.5px;
          -webkit-tap-highlight-color: transparent;
          white-space: nowrap;
        }
        .btn-ghost:hover { border-color: #2d3748; color: #9ca3af; }

        .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-row .btn-primary { flex: 1; min-width: 140px; }

        /* ── LOADING ── */
        .loading-wrap { padding: clamp(40px, 8vw, 60px) 0; text-align: center; }
        .loader {
          width: clamp(40px, 8vw, 56px); height: clamp(40px, 8vw, 56px);
          margin: 0 auto clamp(20px, 4vw, 28px);
          border-radius: 50%; border: 2px solid #1a2030;
          border-top-color: #10b981;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(24px, 5vw, 32px); letter-spacing: 2px; color: #fff;
          margin-bottom: 8px;
        }
        .loading-sub { color: #4b5563; font-size: clamp(12px, 2.5vw, 14px); font-weight: 300; min-height: 22px; }

        /* ── SCORE ── */
        .score-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: clamp(20px, 5vw, 40px);
          align-items: center;
        }
        .score-ring-wrap {
          position: relative;
          width: clamp(100px, 18vw, 130px);
          height: clamp(100px, 18vw, 130px);
          flex-shrink: 0;
        }
        .score-ring-wrap svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .score-text {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); text-align: center;
        }
        .score-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px, 6vw, 42px); line-height: 1; letter-spacing: 1px;
        }
        .score-denom { font-size: clamp(9px, 2vw, 11px); color: #4b5563; letter-spacing: 1px; font-weight: 500; }
        .score-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(26px, 5vw, 38px); letter-spacing: 2px; color: #fff;
          margin-bottom: 8px; line-height: 1;
        }
        .score-desc { font-size: clamp(12px, 2.5vw, 14px); color: #6b7280; line-height: 1.7; font-weight: 300; }

        /* ── TABS ── */
        .tabs {
          display: flex; gap: 2px; margin-bottom: 24px;
          background: #080b0f; border-radius: 10px; padding: 4px;
        }
        .tab-btn {
          flex: 1; padding: clamp(8px, 2vw, 10px) 4px;
          font-family: 'Outfit', sans-serif;
          font-size: clamp(10px, 2vw, 12px); font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; border: none; border-radius: 8px;
          cursor: pointer; transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }

        /* ── RESULTS ── */
        .section-label {
          font-size: clamp(9px, 2vw, 10px); font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: #1a2030; }

        .result-list { display: flex; flex-direction: column; gap: 2px; }
        .result-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px);
          border-radius: 8px; background: #080b0f;
          font-size: clamp(12px, 2.5vw, 14px);
          color: #9ca3af; line-height: 1.6; font-weight: 300;
          transition: background 0.15s;
        }
        .result-item:hover { background: #0d1117; }
        .result-dot {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0; margin-top: 7px;
        }

        /* ── KEYWORDS ── */
        .keyword-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .kw-tag {
          padding: clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px);
          border-radius: 20px; font-size: clamp(11px, 2vw, 12px);
          font-weight: 600; letter-spacing: 0.5px;
        }
        .kw-matched { background: #10b98112; color: #10b981; border: 1px solid #10b98125; }
        .kw-missing { background: #ef444412; color: #f87171; border: 1px solid #ef444425; }

        /* ── REWRITE ── */
        .rewrite-box {
          background: #080b0f; border-left: 2px solid #10b981;
          border-radius: 8px; padding: clamp(14px, 3vw, 20px) clamp(16px, 3vw, 24px);
          font-size: clamp(12px, 2.5vw, 14px); color: #9ca3af;
          line-height: 1.9; font-weight: 300; font-style: italic;
        }
        .copy-btn {
          margin-top: 14px; font-size: clamp(12px, 2.5vw, 13px);
          color: #10b981; background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-weight: 600;
          padding: 0; -webkit-tap-highlight-color: transparent;
        }

        /* ── MOBILE SPECIFIC ── */
        @media (max-width: 480px) {
          .score-card {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 20px;
          }
          .score-ring-wrap { margin: 0 auto; }
          .hero-title { letter-spacing: 1px; }
          .stepper { gap: 0; }
          .step-line { margin: 0 8px; min-width: 12px; }
          .header { margin-bottom: 28px; }
          .hero { margin-bottom: 32px; }
        }

        /* ── TABLET ── */
        @media (min-width: 481px) and (max-width: 768px) {
          .wrap { padding: 0 20px 80px; }
          .score-card { gap: 28px; }
        }

        /* ── DESKTOP ── */
        @media (min-width: 769px) {
          .wrap { padding: 0 32px 80px; }
          .header { padding: 28px 0 28px; margin-bottom: 56px; }
          .hero { margin-bottom: 56px; }
        }
      `}</style>

      <div className="grain" />
      <div className="bg-glow" />

      <div className="wrap">
        {/* Header */}
        <header className="header">
          <div className="logo">RESUME<span>AI</span></div>
          <div className="badge">Powered by LLaMA 3.3</div>
        </header>

        {/* Hero */}
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
          {[{ n: 1, label: "Resume" }, { n: 2, label: "Job Post" }, { n: 3, label: "Results" }].map((s, i) => {
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

        {/* Step 1 — Resume */}
        {step === 1 && (
          <div className="card">
            <div className="field-label">Your Resume</div>
            <textarea
              placeholder="Paste your full resume here — work experience, skills, education..."
              value={resume}
              onChange={e => setResume(e.target.value)}
              rows={7}
            />
            <div className="char-count">{resume.length} characters</div>
            <div style={{ marginTop: 16 }}>
              <button className="btn-primary" onClick={() => setStep(2)} disabled={resume.trim().length < 20}>
                Continue to Job Description →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Job Description */}
        {step === 2 && (
          <div className="card">
            <div className="field-label">Job Description</div>
            <textarea
              placeholder="Paste the job posting you want to apply for..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              rows={7}
            />
            <div className="char-count">{jobDesc.length} characters</div>
            <div style={{ marginTop: 16 }} className="btn-row">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={analyze} disabled={jobDesc.trim().length < 20}>
                Analyze with AI ✦
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Loading */}
        {step === 3 && loading && (
          <div className="card">
            <div className="loading-wrap">
              <div className="loader" />
              <div className="loading-title">ANALYZING</div>
              <div className="loading-sub">{loadingMessages[loadingText]}</div>
            </div>
          </div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && result && (
          <>
            <div className="card">
              <div className="score-card">
                <div className="score-ring-wrap">
                  <svg viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r="54" fill="none" stroke="#1a2030" strokeWidth="10" />
                    <circle
                      cx="65" cy="65" r="54" fill="none"
                      stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
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
                    Your resume has been analyzed against the job requirements. See the breakdown below for detailed insights.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="tabs">
                {[{ id: "overview", label: "Overview" }, { id: "keywords", label: "Keywords" }, { id: "rewrite", label: "Rewrite" }].map(t => (
                  <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)} style={{
                    background: activeTab === t.id ? "#0d1117" : "transparent",
                    color: activeTab === t.id ? "#fff" : "#4b5563",
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div>
                  <div className="section-label" style={{ color: "#10b981" }}>Strengths</div>
                  <div className="result-list" style={{ marginBottom: 24 }}>
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
                  <div className="keyword-grid" style={{ marginBottom: 24 }}>
                    {result.matchedKeywords?.map(k => <span key={k} className="kw-tag kw-matched">{k}</span>)}
                  </div>
                  <div className="section-label" style={{ color: "#f87171" }}>Missing Keywords</div>
                  <div className="keyword-grid">
                    {result.missingKeywords?.map(k => <span key={k} className="kw-tag kw-missing">{k}</span>)}
                  </div>
                </div>
              )}

              {activeTab === "rewrite" && (
                <div>
                  <div className="section-label" style={{ color: "#10b981" }}>AI Rewritten Summary</div>
                  <p style={{ fontSize: "clamp(12px, 2.5vw, 13px)", color: "#4b5563", marginBottom: 14, lineHeight: 1.7, fontWeight: 300 }}>
                    A tailored professional summary optimized for this specific role:
                  </p>
                  <div className="rewrite-box">"{result.rewrittenSummary}"</div>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.rewrittenSummary)}>
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