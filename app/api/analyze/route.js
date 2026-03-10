export async function POST(req) {
  const { resume, jobDescription } = await req.json();

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
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    }
  );

  const data = await response.json();
  console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

  if (!data.choices || !data.choices[0]) {
    return Response.json({ error: "Groq API failed", details: data }, { status: 500 });
  }

  const text = data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  const result = JSON.parse(clean);

  return Response.json(result);
}