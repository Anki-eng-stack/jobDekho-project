const Review = require("../models/Review");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const normalizeEmploymentStatus = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "current") return "Current";
  if (normalized === "former") return "Former";
  return "";
};

const normalizeCeoApproval = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "approve") return "Approve";
  if (normalized === "neutral") return "Neutral";
  if (normalized === "disapprove") return "Disapprove";
  return "";
};

const clampRating = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return Math.max(1, Math.min(5, num));
};

const parseBool = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
};

const normalizeSubRatings = (subRatings) => {
  const source = subRatings || {};
  const keys = [
    "workCulture",
    "salaryBenefits",
    "workLifeBalance",
    "management",
    "careerGrowth",
  ];

  const normalized = {};
  for (const key of keys) {
    const safe = clampRating(source[key]);
    if (safe) normalized[key] = safe;
  }
  return normalized;
};

const averageFromSubRatings = (subRatings) => {
  const values = Object.values(subRatings || {}).map(Number).filter(Boolean);
  if (!values.length) return null;
  return Number((values.reduce((sum, n) => sum + n, 0) / values.length).toFixed(1));
};

const calcAverage = (values) => {
  if (!values.length) return 0;
  return Number((values.reduce((sum, n) => sum + n, 0) / values.length).toFixed(1));
};

const buildFallbackSummary = (reviews, ratingSummary) => {
  if (!reviews.length) return ["Not enough reviews yet to generate a meaningful summary."];

  const avg = calcAverage(reviews.map((r) => Number(r.rating || 0)));
  const recommendsYes = reviews.filter((r) => r.recommends === true).length;
  const recommendsNo = reviews.filter((r) => r.recommends === false).length;

  const insights = [];
  if (avg >= 4) insights.push("Overall sentiment is strongly positive.");
  if (avg >= 3 && avg < 4) insights.push("Sentiment is mixed, with clear trade-offs across teams.");
  if (avg < 3) insights.push("Overall sentiment suggests persistent employee concerns.");

  if (recommendsYes + recommendsNo > 0) {
    const pct = Math.round((recommendsYes / (recommendsYes + recommendsNo)) * 100);
    insights.push(`${pct}% of reviewers say they would recommend this company.`);
  }

  if ((ratingSummary.workLifeBalance || 0) < 3.5) {
    insights.push("Work-life balance appears to be a common pain point.");
  }
  if ((ratingSummary.salaryBenefits || 0) < 3.5) {
    insights.push("Compensation and benefits are frequently rated as average or below.");
  }

  return insights.slice(0, 5);
};

const askGeminiForSummary = async (company, reviews) => {
  if (!GEMINI_API_KEY) return null;

  const trimmed = reviews.slice(0, 100).map((r, idx) => {
    const sub = r.subRatings || {};
    return [
      `${idx + 1}. Rating: ${r.rating}/5`,
      `Role: ${r.role || "N/A"}`,
      `Pros: ${r.pros || "-"}`,
      `Cons: ${r.cons || "-"}`,
      `Advice: ${r.advice || "-"}`,
      `Recommend: ${r.recommends === null ? "N/A" : r.recommends ? "Yes" : "No"}`,
      `SubRatings: WC ${sub.workCulture || "-"}, SB ${sub.salaryBenefits || "-"}, WLB ${sub.workLifeBalance || "-"}, Mgmt ${sub.management || "-"}, CG ${sub.careerGrowth || "-"}`,
    ].join(" | ");
  });

  const prompt = [
    `Summarize employee reviews for ${company} in 3-5 bullet insights.`,
    "Focus on strengths, weaknesses, and recurring patterns from the evidence.",
    "Use concise neutral wording. Return bullet lines only.",
    "Reviews:",
    ...trimmed,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) return null;

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("")
    .trim();
  if (!text) return null;

  return text
    .split("\n")
    .map((line) => line.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
};

const withHelpfulMeta = (review, userId) => {
  const votes = Array.isArray(review.helpfulVotes) ? review.helpfulVotes : [];
  const helpfulCount = votes.length;
  const userHelpful = userId
    ? votes.some((v) => String(v) === String(userId) || String(v?._id) === String(userId))
    : false;

  return {
    ...review,
    helpfulCount,
    userHelpful,
    helpfulVotes: undefined,
  };
};

const buildRatingSummary = (reviews) => {
  const categories = {
    workCulture: [],
    salaryBenefits: [],
    workLifeBalance: [],
    management: [],
    careerGrowth: [],
  };

  for (const item of reviews) {
    const sub = item.subRatings || {};
    categories.workCulture.push(Number(sub.workCulture || item.rating || 0));
    categories.salaryBenefits.push(Number(sub.salaryBenefits || item.rating || 0));
    categories.workLifeBalance.push(Number(sub.workLifeBalance || item.rating || 0));
    categories.management.push(Number(sub.management || item.rating || 0));
    categories.careerGrowth.push(Number(sub.careerGrowth || item.rating || 0));
  }

  return {
    workCulture: calcAverage(categories.workCulture.filter(Boolean)),
    salaryBenefits: calcAverage(categories.salaryBenefits.filter(Boolean)),
    workLifeBalance: calcAverage(categories.workLifeBalance.filter(Boolean)),
    management: calcAverage(categories.management.filter(Boolean)),
    careerGrowth: calcAverage(categories.careerGrowth.filter(Boolean)),
  };
};

exports.createReview = async (req, res) => {
  try {
    const {
      company,
      headline,
      rating,
      subRatings,
      role,
      pros,
      cons,
      advice,
      employmentStatus,
      recommends,
      ceoApproval,
      isAnonymous,
      location,
      industry,
      logo,
      job,
    } = req.body;

    if (!company || !String(company).trim()) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const safeSubRatings = normalizeSubRatings(subRatings);
    const derivedFromSub = averageFromSubRatings(safeSubRatings);
    const safeRating = clampRating(rating) || derivedFromSub;

    if (!safeRating) {
      return res.status(400).json({ error: "Provide overall rating or valid sub ratings (1-5)." });
    }

    const newReview = await Review.create({
      company: String(company).trim(),
      headline: String(headline || "").trim(),
      rating: safeRating,
      subRatings: safeSubRatings,
      role: String(role || "").trim(),
      pros: String(pros || "").trim(),
      cons: String(cons || "").trim(),
      advice: String(advice || "").trim(),
      employmentStatus: normalizeEmploymentStatus(employmentStatus),
      recommends: parseBool(recommends),
      ceoApproval: normalizeCeoApproval(ceoApproval),
      isAnonymous: Boolean(isAnonymous),
      location: String(location || "").trim(),
      industry: String(industry || "").trim(),
      logo: String(logo || "").trim(),
      user: req.user.id,
      job: job || undefined,
    });

    return res.status(201).json({ message: "Review posted", review: newReview });
  } catch (err) {
    console.error("Create review error:", err.message);
    return res.status(500).json({ error: "Failed to post review" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("user", "name role")
      .lean();

    return res.json({
      reviews: reviews.map((item) => withHelpfulMeta(item, req.user?.id)),
      total: reviews.length,
    });
  } catch (err) {
    console.error("Get all reviews error:", err.message);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

exports.getCompanyReviews = async (req, res) => {
  try {
    const companyId = decodeURIComponent(String(req.params.companyId || "")).trim();
    if (!companyId) {
      return res.status(400).json({ error: "Company is required" });
    }

    const {
      role,
      rating,
      sort,
      location,
      employmentStatus,
      recommends,
      page = 1,
      limit = 8,
    } = req.query;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(30, Number(limit) || 8));

    const match = { company: companyId };

    if (role) match.role = { $regex: String(role).trim(), $options: "i" };
    if (location) match.location = { $regex: String(location).trim(), $options: "i" };

    const status = normalizeEmploymentStatus(employmentStatus);
    if (status) match.employmentStatus = status;

    const minRating = clampRating(rating);
    if (minRating) match.rating = { $gte: minRating };

    const recommendFilter = parseBool(recommends);
    if (recommendFilter !== null) match.recommends = recommendFilter;

    const sortBy = String(sort || "newest").toLowerCase();
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1, createdAt: -1 },
      lowest: { rating: 1, createdAt: -1 },
      helpful: { createdAt: -1 },
    };

    const totalFiltered = await Review.countDocuments(match);

    let reviews = await Review.find(match)
      .sort(sortMap[sortBy] || sortMap.newest)
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .populate("user", "name role")
      .lean();

    if (sortBy === "helpful") {
      reviews = reviews.sort(
        (a, b) =>
          (Array.isArray(b.helpfulVotes) ? b.helpfulVotes.length : 0) -
          (Array.isArray(a.helpfulVotes) ? a.helpfulVotes.length : 0)
      );
    }

    const allCompanyReviews = await Review.find({ company: companyId }).lean();
    const totalReviews = allCompanyReviews.length;
    const averageRating = calcAverage(allCompanyReviews.map((item) => Number(item.rating || 0)));

    const yesRecommend = allCompanyReviews.filter((r) => r.recommends === true).length;
    const noRecommend = allCompanyReviews.filter((r) => r.recommends === false).length;
    const recommendTotal = yesRecommend + noRecommend;
    const recommendPercentage = recommendTotal
      ? Math.round((yesRecommend / recommendTotal) * 100)
      : 0;

    const ceoApprovalVotes = allCompanyReviews.filter((r) => r.ceoApproval && r.ceoApproval !== "")
      .length;
    const ceoApprove = allCompanyReviews.filter((r) => r.ceoApproval === "Approve").length;
    const ceoApprovalPercentage = ceoApprovalVotes
      ? Math.round((ceoApprove / ceoApprovalVotes) * 100)
      : 0;

    const ratingSummary = buildRatingSummary(allCompanyReviews);

    const overviewSource = allCompanyReviews[0] || null;
    const companyOverview = {
      name: companyId,
      logo: overviewSource?.logo || "",
      location: overviewSource?.location || "Not specified",
      industry: overviewSource?.industry || "Not specified",
      totalReviews,
      averageRating,
      recommendPercentage,
      ceoApprovalPercentage,
    };

    return res.json({
      companyOverview,
      ratingSummary,
      filtersApplied: {
        role: role || "",
        rating: minRating || "",
        sort: sortBy,
        location: location || "",
        employmentStatus: status || "",
        recommends: recommendFilter,
      },
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: totalFiltered,
        totalPages: Math.max(1, Math.ceil(totalFiltered / safeLimit)),
      },
      reviews: reviews.map((item) => withHelpfulMeta(item, req.user?.id)),
    });
  } catch (err) {
    console.error("Get company reviews error:", err.message);
    return res.status(500).json({ error: "Failed to fetch company reviews" });
  }
};

exports.getCompanyAISummary = async (req, res) => {
  try {
    const companyId = decodeURIComponent(String(req.params.companyId || "")).trim();
    if (!companyId) {
      return res.status(400).json({ error: "Company is required" });
    }

    const reviews = await Review.find({ company: companyId })
      .sort({ createdAt: -1 })
      .select("rating subRatings role pros cons advice recommends")
      .lean();

    const ratingSummary = buildRatingSummary(reviews);
    const geminiSummary = reviews.length ? await askGeminiForSummary(companyId, reviews) : null;
    const fallbackSummary = buildFallbackSummary(reviews, ratingSummary);

    return res.json({
      company: companyId,
      count: reviews.length,
      source: geminiSummary ? "gemini" : "fallback",
      summary: geminiSummary || fallbackSummary,
    });
  } catch (err) {
    console.error("Get AI summary error:", err.message);
    return res.status(500).json({ error: "Failed to generate AI summary" });
  }
};

exports.toggleHelpfulVote = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const userId = String(req.user.id);
    const existingIndex = review.helpfulVotes.findIndex((v) => String(v) === userId);

    if (existingIndex >= 0) {
      review.helpfulVotes.splice(existingIndex, 1);
    } else {
      review.helpfulVotes.push(req.user.id);
    }

    await review.save();

    return res.json({
      message: existingIndex >= 0 ? "Helpful vote removed" : "Marked as helpful",
      helpfulCount: review.helpfulVotes.length,
      userHelpful: existingIndex < 0,
    });
  } catch (err) {
    console.error("Helpful vote error:", err.message);
    return res.status(500).json({ error: "Failed to update helpful vote" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    return res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err.message);
    return res.status(500).json({ error: "Failed to delete review" });
  }
};
