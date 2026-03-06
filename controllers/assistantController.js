const Job = require("../models/Job");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

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

const askGemini = async (message) => {
  if (!GEMINI_API_KEY) {
    const err = new Error("GEMINI_API_KEY is missing in environment variables.");
    err.status = 500;
    throw err;
  }

  const systemPrompt = [
    "You are JobDekho Hiring Assistant.",
    "Help with explaining job requirements, generating interview questions, improving resumes, and drafting recruiter job descriptions.",
    "Keep responses structured, practical, and concise.",
  ].join(" ");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser: ${String(message)}` }],
          },
        ],
      }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason =
      data?.error?.message || `Gemini request failed with status ${response.status}`;
    const err = new Error(reason);
    err.status = response.status;
    throw err;
  }

  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("")
    .trim();

  return reply || "No response generated.";
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

    const reply = await askGemini(message);
    return res.json({ source: "gemini", reply });
  } catch (error) {
    const status = error?.status || 503;
    const detail = error?.message || "Cannot reach Gemini service.";
    console.error("Assistant error:", status, detail);
    return res.status(status).json({
      error: "Gemini unavailable",
      detail:
        detail || "Cannot reach Gemini API. Set GEMINI_API_KEY (and optional GEMINI_MODEL) in .env.",
    });
  }
};
