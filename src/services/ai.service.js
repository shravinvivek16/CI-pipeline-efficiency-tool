import axios from "axios";

export async function generateFixSuggestion(bottleneck) {
  try {
    const prompt = `
You are a senior DevOps engineer.

Analyze this CI bottleneck and respond ONLY in this exact format:

Problem: ...
Cause: ...
Fix:
- ...
- ...
Impact: ...
YAML:
<code>

Rules:
- YAML must be realistic and usable
- Include caching or parallelization where relevant
- Keep it short (one job or step modification)

Keep it concise. No explanations. No extra text.
`;

    let response;
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          }
        );
        break;
      } catch (error) {
        if (error.response?.status === 503 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "No suggestion generated";
  } catch (error) {
    console.error(error.response?.data || error.message);
    return "AI suggestion unavailable";
  }
}