import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import RatingSummary from "../components/RatingSummary";
import ReviewFilters from "../components/ReviewFilters";
import {
  Building2, Star, MapPin, Users, ThumbsUp,
  Sparkles, ChevronLeft, ChevronRight, MessageSquare,
} from "lucide-react";

const defaultFilters = {
  role: "", rating: "", sort: "newest",
  location: "", employmentStatus: "", recommends: "",
};

const renderStars = (value) => {
  const safe = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return "★".repeat(safe) + "☆".repeat(5 - safe);
};

const Reviews = () => {
  const [companies, setCompanies]           = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [reviews, setReviews]               = useState([]);
  const [companyOverview, setCompanyOverview] = useState(null);
  const [ratingSummary, setRatingSummary]   = useState(null);
  const [filters, setFilters]               = useState(defaultFilters);
  const [page, setPage]                     = useState(1);
  const [pagination, setPagination]         = useState({ page:1, totalPages:1, total:0 });
  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]         = useState(false);
  const [aiSummary, setAiSummary]           = useState([]);

  const loadCompanies = async () => {
    try {
      const res = await API.get("/reviews");
      const list = Array.isArray(res.data?.reviews) ? res.data.reviews : [];
      const unique = [...new Set(list.map(i => i.company).filter(Boolean))];
      setCompanies(unique);
      if (!selectedCompany && unique.length) setSelectedCompany(unique[0]);
    } catch (err) { console.error("Failed to load companies:", err); }
  };

  const loadCompanyReviews = async () => {
    if (!selectedCompany) { setReviews([]); setCompanyOverview(null); setRatingSummary(null); setLoading(false); return; }
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "8" });
      Object.entries(filters).forEach(([k, v]) => { if (v !== "" && v != null) params.set(k, v); });
      const res = await API.get(`/reviews/company/${encodeURIComponent(selectedCompany)}?${params}`);
      setReviews(Array.isArray(res.data?.reviews) ? res.data.reviews : []);
      setCompanyOverview(res.data?.companyOverview || null);
      setRatingSummary(res.data?.ratingSummary || null);
      setPagination(res.data?.pagination || { page:1, totalPages:1, total:0 });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load company reviews.");
    } finally { setLoading(false); }
  };

  const loadAISummary = async () => {
    if (!selectedCompany) { setAiSummary([]); return; }
    try {
      const res = await API.get(`/reviews/company/${encodeURIComponent(selectedCompany)}/ai-summary`);
      setAiSummary(Array.isArray(res.data?.summary) ? res.data.summary : []);
    } catch { setAiSummary(["AI summary is currently unavailable."]); }
  };

  useEffect(() => { loadCompanies(); }, []);
  useEffect(() => { loadCompanyReviews(); }, [selectedCompany, filters, page]);
  useEffect(() => { loadAISummary(); }, [selectedCompany]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilters = () => { setFilters(defaultFilters); setPage(1); };

  const handleHelpful = async (reviewId) => {
    try {
      const res = await API.post(`/reviews/${reviewId}/helpful`);
      setReviews(prev => prev.map(item =>
        item._id === reviewId ? { ...item, helpfulCount: res.data.helpfulCount, userHelpful: res.data.userHelpful } : item
      ));
    } catch (err) { toast.error(err.response?.data?.error || "Could not update helpful vote."); }
  };

  const handleSubmitReview = async (formData) => {
    try {
      setSubmitting(true);
      await API.post("/reviews", formData);
      toast.success("Review submitted successfully.");
      await loadCompanies();
      if (formData.company) setSelectedCompany(formData.company);
      setPage(1);
      await loadCompanyReviews();
      await loadAISummary();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review.");
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-rv { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); padding:2.5rem 1rem; }

        .jd-rv-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem; }

        /* Page header */
        .jd-rv-ph { background:white; border-radius:20px; border:1.5px solid #ede9fe; box-shadow:0 8px 32px rgba(124,58,237,0.10); overflow:hidden; }
        .jd-rv-ph-inner { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.5rem 2rem; display:flex; align-items:center; gap:1rem; position:relative; overflow:hidden; }
        .jd-rv-ph-inner::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-rv-ph-icon  { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-rv-ph-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; }
        .jd-rv-ph-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; }

        /* Company selector */
        .jd-rv-selector { padding:1.25rem 2rem; display:flex; align-items:center; gap:0.875rem; flex-wrap:wrap; }
        .jd-rv-sel-label { font-size:0.78rem; font-weight:700; color:#7c3aed; text-transform:uppercase; letter-spacing:0.06em; white-space:nowrap; }
        .jd-rv-sel-wrap  { position:relative; flex:1; min-width:200px; }
        .jd-rv-sel-wrap::after { content:''; position:absolute; right:12px; top:50%; transform:translateY(-50%); border-left:4px solid transparent; border-right:4px solid transparent; border-top:5px solid #7c3aed; pointer-events:none; }
        .jd-rv-select { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px; padding:0.6rem 2rem 0.6rem 0.875rem; outline:none; transition:all 0.2s; width:100%; appearance:none; -webkit-appearance:none; cursor:pointer; }
        .jd-rv-select:focus { border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        /* Company overview card */
        .jd-rv-overview { background:white; border-radius:18px; border:1.5px solid #ede9fe; box-shadow:0 4px 20px rgba(124,58,237,0.08); overflow:hidden; }
        .jd-rv-ov-head   { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.1rem 1.5rem; display:flex; align-items:center; gap:0.75rem; position:relative; overflow:hidden; }
        .jd-rv-ov-head::before { content:''; position:absolute; top:-30px; right:-30px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-rv-ov-head-icon { width:34px; height:34px; border-radius:9px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; z-index:1; }
        .jd-rv-ov-head-title { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:800; color:white; margin:0; z-index:1; }
        .jd-rv-ov-body { padding:1.25rem 1.5rem; display:flex; align-items:center; gap:1.25rem; flex-wrap:wrap; }
        .jd-rv-ov-logo { width:64px; height:64px; border-radius:14px; border:1.5px solid #ede9fe; object-fit:cover; flex-shrink:0; }
        .jd-rv-ov-name  { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800; color:#1e1b4b; margin:0 0 4px; }
        .jd-rv-ov-stars { font-size:1.1rem; color:#f59e0b; margin-bottom:3px; letter-spacing:2px; }
        .jd-rv-ov-meta  { display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:6px; }
        .jd-rv-ov-pill  { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:999px; padding:0.25rem 0.7rem; font-size:0.75rem; font-weight:600; color:#475569; display:flex; align-items:center; gap:4px; }

        /* Section label */
        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.875rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        /* Panel wrapper */
        .jd-rv-panel { background:white; border-radius:18px; border:1.5px solid #ede9fe; box-shadow:0 4px 20px rgba(124,58,237,0.08); overflow:hidden; }
        .jd-rv-panel-head { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1rem 1.25rem; display:flex; align-items:center; gap:0.75rem; }
        .jd-rv-panel-head-icon { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; }
        .jd-rv-panel-head-title { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:800; color:white; margin:0; }
        .jd-rv-panel-body { padding:1.25rem; }

        /* Review grid */
        .jd-rv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1rem; }

        /* Pagination */
        .jd-rv-pag { display:flex; align-items:center; justify-content:space-between; padding-top:1rem; flex-wrap:wrap; gap:0.5rem; }
        .jd-rv-pag-info { font-size:0.78rem; color:#94a3b8; font-weight:500; }
        .jd-rv-pag-btns { display:flex; align-items:center; gap:0.5rem; }
        .jd-rv-pag-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:600; color:#7c3aed; background:white; border:1.5px solid #ddd6fe; border-radius:8px; padding:0.4rem 0.75rem; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:4px; }
        .jd-rv-pag-btn:hover:not(:disabled) { background:#f5f3ff; border-color:#a78bfa; }
        .jd-rv-pag-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .jd-rv-pag-label { font-size:0.78rem; font-weight:600; color:#1e1b4b; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:8px; padding:0.4rem 0.75rem; }

        /* AI summary */
        .jd-rv-ai { background:white; border-radius:18px; border:1.5px solid #ede9fe; box-shadow:0 4px 20px rgba(124,58,237,0.08); overflow:hidden; }
        .jd-rv-ai-head { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1rem 1.25rem; display:flex; align-items:center; gap:0.75rem; }
        .jd-rv-ai-item { display:flex; align-items:flex-start; gap:0.625rem; padding:0.625rem 0; border-bottom:1px solid #f3f0ff; font-size:0.875rem; color:#334155; line-height:1.6; }
        .jd-rv-ai-item:last-child { border-bottom:none; }
        .jd-rv-ai-dot  { width:7px; height:7px; border-radius:50%; background:#7c3aed; flex-shrink:0; margin-top:7px; }

        /* Empty / loading */
        .jd-rv-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2.5rem 1rem; gap:0.625rem; }
        .jd-rv-empty-text { font-size:0.875rem; color:#94a3b8; font-weight:500; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
      `}</style>

      <div className="jd-rv">
        <div className="jd-rv-inner">

          {/* Page Header */}
          <div className="jd-rv-ph">
            <div className="jd-rv-ph-inner">
              <div className="jd-rv-ph-icon"><Star size={20} color="white" /></div>
              <div>
                <p className="jd-rv-ph-title">Company Reviews</p>
                <p className="jd-rv-ph-sub">Explore honest reviews and ratings from real employees</p>
              </div>
            </div>
            {/* Company Selector */}
            <div className="jd-rv-selector">
              <span className="jd-rv-sel-label">Select Company</span>
              <div className="jd-rv-sel-wrap">
                <select className="jd-rv-select" value={selectedCompany}
                  onChange={e => { setSelectedCompany(e.target.value); setPage(1); }}>
                  {companies.length === 0
                    ? <option value="">No companies yet</option>
                    : companies.map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
              </div>
            </div>
          </div>

          {/* Company Overview */}
          {companyOverview ? (
            <div className="jd-rv-overview">
              <div className="jd-rv-ov-head">
                <div className="jd-rv-ov-head-icon"><Building2 size={16} color="white" /></div>
                <p className="jd-rv-ov-head-title">Company Overview</p>
              </div>
              <div className="jd-rv-ov-body">
                <img src={companyOverview.logo || "https://placehold.co/64x64/ede9fe/7c3aed?text=Co"}
                  alt={`${companyOverview.name} logo`} className="jd-rv-ov-logo"
                  onError={e => { e.target.src = "https://placehold.co/64x64/ede9fe/7c3aed?text=Co"; }} />
                <div style={{ flex:1 }}>
                  <p className="jd-rv-ov-name">{companyOverview.name}</p>
                  <p className="jd-rv-ov-stars">{renderStars(companyOverview.averageRating)}</p>
                  <p style={{ fontSize:"0.78rem", color:"#64748b", marginBottom:6 }}>
                    <strong style={{ color:"#7c3aed" }}>{companyOverview.averageRating}</strong> / 5 &nbsp;·&nbsp; {companyOverview.totalReviews} Reviews
                  </p>
                  <div className="jd-rv-ov-meta">
                    {companyOverview.industry && <span className="jd-rv-ov-pill"><Building2 size={11} />{companyOverview.industry}</span>}
                    {companyOverview.location  && <span className="jd-rv-ov-pill"><MapPin    size={11} />{companyOverview.location}</span>}
                    {companyOverview.recommendPercentage != null && <span className="jd-rv-ov-pill"><ThumbsUp size={11} />Recommend: {companyOverview.recommendPercentage}%</span>}
                    {companyOverview.ceoApprovalPercentage != null && <span className="jd-rv-ov-pill"><Users size={11} />CEO Approval: {companyOverview.ceoApprovalPercentage}%</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="jd-rv-panel">
              <div className="jd-rv-panel-body">
                <p style={{ fontSize:"0.875rem", color:"#94a3b8", textAlign:"center", padding:"1rem 0" }}>
                  Select a company to view its overview and reviews.
                </p>
              </div>
            </div>
          )}

          {/* Rating Summary — delegated to existing component */}
          <RatingSummary summary={ratingSummary} />

          {/* Filters — delegated to existing component */}
          <ReviewFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

          {/* Reviews Grid */}
          <div className="jd-rv-panel">
            <div className="jd-rv-panel-head">
              <div className="jd-rv-panel-head-icon"><MessageSquare size={16} color="white" /></div>
              <p className="jd-rv-panel-head-title">Employee Reviews</p>
              {!loading && <span style={{ marginLeft:"auto", background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:"999px", padding:"0.2rem 0.65rem", fontSize:"0.75rem", fontFamily:"'Syne',sans-serif", fontWeight:700, color:"white" }}>{pagination.total || 0} Total</span>}
            </div>
            <div className="jd-rv-panel-body">
              {loading ? (
                <div className="jd-rv-empty">
                  <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #ede9fe", borderTopColor:"#7c3aed", animation:"jdSpin 0.7s linear infinite" }} />
                  <p className="jd-rv-empty-text">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="jd-rv-empty">
                  <MessageSquare size={38} color="#ddd6fe" />
                  <p className="jd-rv-empty-text">No reviews found for the selected filters.</p>
                </div>
              ) : (
                <div className="jd-rv-grid">
                  {reviews.map(review => (
                    <ReviewCard key={review._id} review={review} onHelpful={handleHelpful} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="jd-rv-pag">
                <p className="jd-rv-pag-info">Showing {reviews.length} of {pagination.total || 0} reviews</p>
                <div className="jd-rv-pag-btns">
                  <button className="jd-rv-pag-btn" disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <span className="jd-rv-pag-label">
                    {pagination.page || 1} / {pagination.totalPages || 1}
                  </span>
                  <button className="jd-rv-pag-btn" disabled={page >= (pagination.totalPages || 1)}
                    onClick={() => setPage(p => Math.min(pagination.totalPages || 1, p + 1))}>
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {aiSummary.length > 0 && (
            <div className="jd-rv-ai">
              <div className="jd-rv-ai-head">
                <div className="jd-rv-panel-head-icon"><Sparkles size={16} color="white" /></div>
                <p className="jd-rv-panel-head-title">AI Summary</p>
              </div>
              <div className="jd-rv-panel-body">
                <p className="jd-section-label"><Sparkles size={12} /> Key Insights</p>
                {aiSummary.map((item, idx) => (
                  <div key={`${item}-${idx}`} className="jd-rv-ai-item">
                    <span className="jd-rv-ai-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Form — delegated to existing component */}
          <ReviewForm defaultCompany={selectedCompany} submitting={submitting} onSubmit={handleSubmitReview} />

        </div>
      </div>
    </>
  );
};

export default Reviews;