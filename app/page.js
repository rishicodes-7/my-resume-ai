"use client";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

    // Check if API returned an error
    if (data.error) {
      alert("API Error: " + data.error + "\nDetails: " + JSON.stringify(data.details));
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
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center">ResumeAI 🤖</h1>
      <p className="text-gray-400 text-center mb-10">Paste your resume + job description. Get an AI match score instantly.</p>

      {step === 1 && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">YOUR RESUME</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white mb-4 h-48 resize-none focus:outline-none focus:border-purple-500"
            placeholder="Paste your resume text here..."
            value={resume}
            onChange={e => setResume(e.target.value)}
          />
          <button
            onClick={() => setStep(2)}
            disabled={resume.length < 20}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold py-3 rounded-lg"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">JOB DESCRIPTION</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white mb-4 h-48 resize-none focus:outline-none focus:border-purple-500"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
          />
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="border border-purple-500 text-purple-400 font-bold py-3 px-6 rounded-lg">← Back</button>
            <button
              onClick={analyze}
              disabled={jobDesc.length < 20}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold py-3 rounded-lg"
            >
              🤖 Analyze Now
            </button>
          </div>
        </div>
      )}

      {step === 3 && loading && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-spin inline-block">⚙️</div>
          <p className="text-gray-400">AI is analyzing your resume...</p>
        </div>
      )}

      {step === 3 && result && (
        <div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-4 text-center">
            <div className="text-6xl font-bold text-purple-400">{result.score}</div>
            <div className="text-gray-400 text-sm mt-1">Match Score / 100</div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-4">
            <h2 className="text-green-400 font-bold mb-3">✅ Strengths</h2>
            {result.strengths.map((s, i) => <p key={i} className="text-gray-300 text-sm mb-2">• {s}</p>)}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-4">
            <h2 className="text-red-400 font-bold mb-3">⚠️ Gaps</h2>
            {result.gaps.map((g, i) => <p key={i} className="text-gray-300 text-sm mb-2">• {g}</p>)}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-4">
            <h2 className="text-blue-400 font-bold mb-3">✍️ Rewritten Summary</h2>
            <p className="text-gray-300 text-sm italic">"{result.rewrittenSummary}"</p>
          </div>

          <button onClick={() => { setStep(1); setResult(null); setResume(""); setJobDesc(""); }}
            className="w-full border border-gray-600 text-gray-400 py-3 rounded-lg">
            ← Start Over
          </button>
        </div>
      )}
    </main>
  );
}