import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import RatingSummary from "../components/RatingSummary";
import ReviewFilters from "../components/ReviewFilters";

const defaultFilters = {
  role: "",
  rating: "",
  sort: "newest",
  location: "",
  employmentStatus: "",
  recommends: "",
};

const renderStars = (value) => {
  const safe = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return "*".repeat(safe) + "-".repeat(5 - safe);
};

const Reviews = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [reviews, setReviews] = useState([]);
  const [companyOverview, setCompanyOverview] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState([]);

  const loadCompanies = async () => {
    try {
      const res = await API.get("/reviews");
      const list = Array.isArray(res.data?.reviews) ? res.data.reviews : [];
      const uniqueCompanies = [...new Set(list.map((item) => item.company).filter(Boolean))];
      setCompanies(uniqueCompanies);
      if (!selectedCompany && uniqueCompanies.length) {
        setSelectedCompany(uniqueCompanies[0]);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  };

  const loadCompanyReviews = async () => {
    if (!selectedCompany) {
      setReviews([]);
      setCompanyOverview(null);
      setRatingSummary(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "8" });
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) params.set(key, value);
      });

      const res = await API.get(
        `/reviews/company/${encodeURIComponent(selectedCompany)}?${params.toString()}`
      );

      setReviews(Array.isArray(res.data?.reviews) ? res.data.reviews : []);
      setCompanyOverview(res.data?.companyOverview || null);
      setRatingSummary(res.data?.ratingSummary || null);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to load company reviews:", err);
      toast.error(err.response?.data?.error || "Failed to load company reviews.");
    } finally {
      setLoading(false);
    }
  };

  const loadAISummary = async () => {
    if (!selectedCompany) {
      setAiSummary([]);
      return;
    }

    try {
      const res = await API.get(`/reviews/company/${encodeURIComponent(selectedCompany)}/ai-summary`);
      setAiSummary(Array.isArray(res.data?.summary) ? res.data.summary : []);
    } catch (err) {
      console.error("Failed to load AI summary:", err);
      setAiSummary(["AI summary is currently unavailable."]);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadCompanyReviews();
  }, [selectedCompany, filters, page]);

  useEffect(() => {
    loadAISummary();
  }, [selectedCompany]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleHelpful = async (reviewId) => {
    try {
      const res = await API.post(`/reviews/${reviewId}/helpful`);
      setReviews((prev) =>
        prev.map((item) =>
          item._id === reviewId
            ? {
                ...item,
                helpfulCount: res.data.helpfulCount,
                userHelpful: res.data.userHelpful,
              }
            : item
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not update helpful vote.");
    }
  };

  const handleSubmitReview = async (formData) => {
    try {
      setSubmitting(true);
      await API.post("/reviews", formData);
      toast.success("Review submitted successfully.");

      await loadCompanies();
      if (formData.company) {
        setSelectedCompany(formData.company);
      }
      setPage(1);
      await loadCompanyReviews();
      await loadAISummary();
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(err.response?.data?.error || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Company Reviews</h2>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {companies.length === 0 ? (
                <option value="">No companies yet</option>
              ) : (
                companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))
              )}
            </select>
          </div>

          {companyOverview ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[80px_1fr] md:items-center">
              <img
                src={companyOverview.logo || "https://placehold.co/80x80?text=Logo"}
                alt={`${companyOverview.name} logo`}
                className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{companyOverview.name}</h3>
                <p className="mt-1 text-sm text-gray-700">
                  {renderStars(companyOverview.averageRating)} {companyOverview.averageRating} ({companyOverview.totalReviews} Reviews)
                </p>
                <p className="text-sm text-gray-600">Industry: {companyOverview.industry}</p>
                <p className="text-sm text-gray-600">Location: {companyOverview.location}</p>
                <p className="text-sm text-gray-600">
                  Recommend: {companyOverview.recommendPercentage || 0}% | CEO Approval: {companyOverview.ceoApprovalPercentage || 0}%
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Select or add a company to view reviews.</p>
          )}
        </section>

        <RatingSummary summary={ratingSummary} />

        <ReviewFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Review Cards</h3>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">No reviews found for the selected filters.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} onHelpful={handleHelpful} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500">Total filtered reviews: {pagination.total || 0}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-gray-600">
                Page {pagination.page || 1} / {pagination.totalPages || 1}
              </span>
              <button
                type="button"
                disabled={page >= (pagination.totalPages || 1)}
                onClick={() => setPage((prev) => Math.min((pagination.totalPages || 1), prev + 1))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900">AI Summary</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-blue-900">
            {aiSummary.map((item, idx) => (
              <li key={`${item}-${idx}`}>{item}</li>
            ))}
          </ul>
        </section>

        <ReviewForm
          defaultCompany={selectedCompany}
          submitting={submitting}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  );
};

export default Reviews;
