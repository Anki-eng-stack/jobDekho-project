import React, { useEffect, useState } from "react";

const initialState = {
  company: "",
  headline: "",
  role: "",
  rating: 5,
  subRatings: {
    workCulture: 5,
    salaryBenefits: 5,
    workLifeBalance: 5,
    management: 5,
    careerGrowth: 5,
  },
  pros: "",
  cons: "",
  advice: "",
  employmentStatus: "Current",
  recommends: "true",
  ceoApproval: "Approve",
  isAnonymous: true,
  location: "",
  industry: "",
  logo: "",
};

const subRatingRows = [
  { name: "workCulture",     label: "Work Culture",      icon: "🏢" },
  { name: "salaryBenefits",  label: "Salary & Benefits", icon: "💰" },
  { name: "workLifeBalance", label: "Work Life Balance",  icon: "⚖️" },
  { name: "management",      label: "Management",         icon: "👔" },
  { name: "careerGrowth",    label: "Career Growth",      icon: "📈" },
];

const StarSelector = ({ value, onChange, name }) => {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? Number(value);
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange({ target: { name, value: String(star) } })}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", lineHeight: 1 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24"
            fill={display >= star ? "#f59e0b" : "none"}
            stroke={display >= star ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
            style={{ transition: "all 0.15s ease" }}
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </button>
      ))}
    </div>
  );
};

const ReviewForm = ({ defaultCompany, onSubmit, submitting }) => {
  const [form, setForm] = useState({ ...initialState, company: defaultCompany || "" });

  useEffect(() => {
    if (defaultCompany) setForm((prev) => ({ ...prev, company: defaultCompany }));
  }, [defaultCompany]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubRatingChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, subRatings: { ...prev.subRatings, [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      rating: Number(form.rating),
      subRatings: Object.fromEntries(
        Object.entries(form.subRatings).map(([k, v]) => [k, Number(v)])
      ),
      recommends: form.recommends === "" ? null : form.recommends === "true",
    };
    await onSubmit(payload);
    setForm((prev) => ({ ...initialState, company: prev.company, location: prev.location, industry: prev.industry, logo: prev.logo }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-form-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 20px;
          border: 1.5px solid #ede9fe;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(124,58,237,0.08);
        }

        .jd-form-header {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          padding: 1.4rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .jd-form-header-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.25);
          font-size: 1.2rem;
        }

        .jd-form-header-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .jd-form-header-sub {
          font-size: 0.78rem;
          color: #c4b5fd;
          margin-top: 1px;
        }

        .jd-form-body {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .jd-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #7c3aed;
          margin-bottom: 0.625rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .jd-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #ede9fe, transparent);
        }

        .jd-input, .jd-select, .jd-textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #1e1b4b;
          background: #faf9ff;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          padding: 0.6rem 0.875rem;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .jd-input::placeholder, .jd-textarea::placeholder {
          color: #c4b5fd;
        }

        .jd-input:focus, .jd-select:focus, .jd-textarea:focus {
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .jd-textarea {
          min-height: 90px;
          resize: vertical;
          line-height: 1.6;
        }

        .jd-select-wrap {
          position: relative;
        }

        .jd-select-wrap::after {
          content: '';
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #7c3aed;
          pointer-events: none;
        }

        .jd-select {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 2rem;
        }

        .jd-field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 4px;
          display: block;
        }

        .jd-sub-rating-card {
          background: #faf9ff;
          border: 1.5px solid #ede9fe;
          border-radius: 12px;
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: border-color 0.2s;
        }

        .jd-sub-rating-card:hover {
          border-color: #a78bfa;
        }

        .jd-sub-rating-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .jd-anonymous-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          background: #f5f3ff;
          border-radius: 10px;
          border: 1.5px solid #ede9fe;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .jd-anonymous-row:hover { border-color: #a78bfa; }

        .jd-anonymous-row input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #7c3aed;
          cursor: pointer;
        }

        .jd-anonymous-text {
          font-size: 0.85rem;
          font-weight: 500;
          color: #4b5563;
        }

        .jd-submit-btn {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          border-radius: 12px;
          padding: 0.85rem 1.5rem;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.02em;
        }

        .jd-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(124,58,237,0.4);
        }

        .jd-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .jd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .jd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .jd-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }

        @media (max-width: 768px) {
          .jd-grid-2, .jd-grid-3, .jd-grid-5 { grid-template-columns: 1fr; }
        }

        @media (min-width: 640px) and (max-width: 1024px) {
          .jd-grid-5 { grid-template-columns: repeat(2, 1fr); }
          .jd-grid-3 { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <section className="jd-form-card">
        {/* Header */}
        <div className="jd-form-header">
          <div className="jd-form-header-icon">✍️</div>
          <div>
            <p className="jd-form-header-title">Write a Review</p>
            <p className="jd-form-header-sub">Share your experience to help others</p>
          </div>
        </div>

        <div className="jd-form-body">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Basic Info */}
            <div>
              <p className="jd-section-label">📋 Basic Info</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <input required name="company" value={form.company} onChange={handleChange}
                  placeholder="Company Name *" className="jd-input" />
                <input required name="headline" value={form.headline} onChange={handleChange}
                  placeholder="Review Headline — e.g. Great culture but slow growth *" className="jd-input" />
                <input required name="role" value={form.role} onChange={handleChange}
                  placeholder="Your Job Role *" className="jd-input" />
              </div>
            </div>

            {/* Overall Rating + Status + Recommends */}
            <div>
              <p className="jd-section-label">⭐ Ratings & Status</p>
              <div className="jd-grid-3">
                <div>
                  <span className="jd-field-label">Overall Rating</span>
                  <div className="jd-select-wrap">
                    <select name="rating" value={form.rating} onChange={handleChange} className="jd-select">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{"⭐".repeat(n)} {n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <span className="jd-field-label">Employment Status</span>
                  <div className="jd-select-wrap">
                    <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange} className="jd-select">
                      <option value="Current">🟢 Current</option>
                      <option value="Former">🔴 Former</option>
                    </select>
                  </div>
                </div>
                <div>
                  <span className="jd-field-label">Recommend to Friend?</span>
                  <div className="jd-select-wrap">
                    <select name="recommends" value={form.recommends} onChange={handleChange} className="jd-select">
                      <option value="true">✓ Yes</option>
                      <option value="false">✗ No</option>
                      <option value="">🤔 Not Sure</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Ratings with interactive stars */}
            <div>
              <p className="jd-section-label">🎯 Detailed Ratings</p>
              <div className="jd-grid-5">
                {subRatingRows.map(({ name, label, icon }) => (
                  <div key={name} className="jd-sub-rating-card">
                    <span className="jd-sub-rating-name">{icon} {label}</span>
                    <StarSelector
                      name={name}
                      value={form.subRatings[name]}
                      onChange={handleSubRatingChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pros / Cons / Advice */}
            <div>
              <p className="jd-section-label">💬 Your Review</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <div>
                  <span className="jd-field-label" style={{ color: "#16a34a" }}>👍 Pros</span>
                  <textarea required name="pros" value={form.pros} onChange={handleChange}
                    placeholder="What do you like about working here?" className="jd-textarea"
                    style={{ borderColor: form.pros ? "#bbf7d0" : undefined }} />
                </div>
                <div>
                  <span className="jd-field-label" style={{ color: "#dc2626" }}>👎 Cons</span>
                  <textarea required name="cons" value={form.cons} onChange={handleChange}
                    placeholder="What could be improved?" className="jd-textarea"
                    style={{ borderColor: form.cons ? "#fecaca" : undefined }} />
                </div>
                <div>
                  <span className="jd-field-label" style={{ color: "#7c3aed" }}>💡 Advice to Management</span>
                  <textarea required name="advice" value={form.advice} onChange={handleChange}
                    placeholder="What advice would you give to leadership?" className="jd-textarea"
                    style={{ borderColor: form.advice ? "#ddd6fe" : undefined }} />
                </div>
              </div>
            </div>

            {/* CEO / Location / Industry */}
            <div>
              <p className="jd-section-label">🏢 Company Details</p>
              <div className="jd-grid-3">
                <div>
                  <span className="jd-field-label">CEO Approval</span>
                  <div className="jd-select-wrap">
                    <select name="ceoApproval" value={form.ceoApproval} onChange={handleChange} className="jd-select">
                      <option value="Approve">✅ Approve</option>
                      <option value="Neutral">😐 Neutral</option>
                      <option value="Disapprove">❌ Disapprove</option>
                      <option value="">No Opinion</option>
                    </select>
                  </div>
                </div>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="Company Location" className="jd-input" style={{ alignSelf: "end" }} />
                <input name="industry" value={form.industry} onChange={handleChange}
                  placeholder="Industry" className="jd-input" style={{ alignSelf: "end" }} />
              </div>
            </div>

            {/* Logo URL */}
            <input name="logo" value={form.logo} onChange={handleChange}
              placeholder="🔗 Company Logo URL (optional)" className="jd-input" />

            {/* Anonymous toggle */}
            <label className="jd-anonymous-row">
              <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} />
              <span className="jd-anonymous-text">
                🕵️ Post as <strong>Anonymous</strong> — your name won't be shown
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="jd-submit-btn">
              {submitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                    style={{ animation: "jdSpin 0.7s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-9-9"/>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Review
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>
      </section>

      <style>{`
        @keyframes jdSpin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default ReviewForm;