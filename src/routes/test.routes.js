import { Router } from "express";
import { getWorkflowRuns } from "../services/github.service.js";
import { analyzeWorkflowRuns } from "../services/analysis.service.js";
import { generateFixSuggestion } from "../services/ai.service.js";

const router = Router();
const fallbackSuggestion =
  "Optimize this job by adding caching, splitting steps, or parallelizing execution.";

router.get("/test-runs", async (req, res) => {
  try {
    const { owner, repo, ai } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ error: "owner and repo required" });
    }

    const data = await getWorkflowRuns(owner, repo);
    const insights = analyzeWorkflowRuns(data);

    let suggestion = fallbackSuggestion;

    if (ai === "true" && insights.bottleneck) {
      try {
        suggestion = await generateFixSuggestion(insights.bottleneck);
        if (!suggestion) {
          suggestion = fallbackSuggestion;
        }
      } catch (error) {
        suggestion = fallbackSuggestion;
      }
    }

    res.json({
      ...insights,
      ai_suggestion: suggestion,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/report", async (req, res) => {
  try {
    const data = await getWorkflowRuns("vercel", "next.js");
    const insights = analyzeWorkflowRuns(data);

    res.json({
      summary:
        insights.bottleneck ||
        "CI pipeline analyzed successfully.",
      issues: [
        {
          issue_name: insights.bottleneck || "General CI inefficiency",
          fix: fallbackSuggestion,
          impact: `Estimated time saved per run: ${insights.time_saved} minutes`,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
