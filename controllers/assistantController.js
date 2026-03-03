const Job = require("../models/Job");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

const extractJobQuery = (message) => {
  const text = String(message || "").trim();
  if (!text) return "";

  const patterns = [
    /(?:jobs?|openings?)\s+(?:for|in|with)\s+([a-z0-9+#.\-\s]+)/i,
    /([a-z0-9+#.\-\s]+)\s+(?:jobs?|openings?)/i,
    /(?:find|search)\s+([a-z0-9+#.\-\s]+)\s+(?:jobs?|openings?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
};

const looksLikeJobSearch = (message) => {
  const text = String(message || "").toLowerCase();
  return /(find|search|show|list).*(jobs?|openings?)|jobs?\s+(for|in|with)/i.test(text);
};

const findJobsFromDatabase = async (queryText) => {
  const query = String(queryText || "").trim();
  if (!query) return [];

  const tokens = query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
  if (!tokens.length) return [];

  const andConditions = tokens.map((token) => {
    const regex = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    return {
      $or: [
        { title: regex },
        { company: regex },
        { location: regex },
        { skills: regex },
        { description: regex },
      ],
    };
  });

  return Job.find({ $and: andConditions })
    .select("title company location salary skills description")
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
};

const askOllama = async (message) => {
  const prompt = [
    "You are JobDekho Hiring Assistant.",
    "Help with explaining job requirements, generating interview questions, improving resumes, and drafting recruiter job descriptions.",
    "Keep responses structured, practical, and concise.",
    "",
    `User: ${String(message)}`,
  ].join("\n");

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = data?.error || `Ollama request failed with status ${response.status}`;
    const err = new Error(reason);
    err.status = response.status;
    throw err;
  }

  return data?.response || "No response generated.";
};

exports.askAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (looksLikeJobSearch(message)) {
      const query = extractJobQuery(message) || String(message);
      const jobs = await findJobsFromDatabase(query);

      if (jobs.length > 0) {
        const lines = jobs
          .map(
            (job, idx) =>
              `${idx + 1}. ${job.title} at ${job.company} (${job.location})${job.salary ? ` - Salary: ${job.salary}` : ""}`
          )
          .join("\n");

        return res.json({
          source: "database",
          reply: `I found ${jobs.length} matching job(s):\n${lines}`,
          jobs,
        });
      }

      return res.json({
        source: "database",
        reply: "No matching jobs found in the database right now. Try different skills, location, or title keywords.",
        jobs: [],
      });
    }

    const reply = await askOllama(message);
    return res.json({ source: "ollama", reply });
  } catch (error) {
    const status = error?.status || 503;
    const detail = error?.message || "Cannot reach local Ollama service.";
    console.error("Assistant error:", status, detail);
    return res.status(status).json({
      error: "Ollama unavailable",
      detail:
        detail ||
        "Cannot reach local Ollama. Start Ollama and run: ollama run llama3 (or set OLLAMA_MODEL/OLLAMA_URL in .env).",
    });
  }
};
