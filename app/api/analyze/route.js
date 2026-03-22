import { NextResponse } from "next/server";

export async function POST(req) {
  let resumeText = "";

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file");
    const jobDescription = formData.get("jobDescription");

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Extract text from PDF buffer
    const PDFParser = (await import("pdf2json")).default;
    const pdfParser = new PDFParser();
    
    resumeText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (data) => {
        const text = data.Pages.flatMap(page =>
          page.Texts.map(t => decodeURIComponent(t.R[0].T))
        ).join(" ");
        resolve(text);
      });
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.parseBuffer(buffer);
    });

    return await analyzeResume(resumeText, jobDescription);
  } else {
    const { resume, jobDescription } = await req.json();
    resumeText = resume;
    return await analyzeResume(resumeText, jobDescription);
  }
}

async function analyzeResume(resume, jobDescription) {
  const prompt = `
    You are a resume expert. Analyze this resume vs the job description.
    RESUME: ${resume}
    JOB DESCRIPTION: ${jobDescription}
    
    Reply ONLY with a JSON object (no markdown, no backticks) with these fields:
    {
      "score": number between 0-100,
      "strengths": array of 3 strings,
      "gaps": array of 3 strings,
      "matchedKeywords": array of strings,
      "missingKeywords": array of strings,
      "rewrittenSummary": string
    }
  `;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    return NextResponse.json(
      { error: "Groq API failed", details: data },
      { status: 500 }
    );
  }

  const text = data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  const result = JSON.parse(clean);

  return NextResponse.json(result);
}