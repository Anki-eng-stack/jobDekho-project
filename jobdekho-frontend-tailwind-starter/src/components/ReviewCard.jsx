import React from "react";
import { ThumbsUp } from "lucide-react";

const subRows = [
  { key: "workCulture",     label: "Work Culture",      icon: "🏢" },
  { key: "salaryBenefits",  label: "Salary & Benefits", icon: "💰" },
  { key: "workLifeBalance", label: "Work Life Balance",  icon: "⚖️" },
  { key: "management",      label: "Management",         icon: "👔" },
  { key: "careerGrowth",    label: "Career Growth",      icon: "📈" },
];

const StarRating = ({ value }) => {
  const safe = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map((star) => (
        <svg key={star} width="14" height="14" viewBox="0 0 24 24"
          fill={safe >= star ? "#f59e0b" : "none"}
          stroke={safe >= star ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
};

const MiniBar = ({ value }) => {
  const pct = (Math.max(0, Math.min(5, Number(value) || 0)) / 5) * 100;
  return (
    <div style={{ flex: 1, height: "5px", borderRadius: "99px", background: "#ede9fe", overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: "99px",
        background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
        transition: "width 0.6s ease"
      }} />
    </div>
  );
};

const ReviewCard = ({ review, onHelpful }) => {
  const rating = Number(review.rating || 0);
  const ratingColor = rating >= 4 ? "#16a34a" : rating >= 3 ? "#f59e0b" : "#dc2626";
  const ratingBg   = rating >= 4 ? "#f0fdf4" : rating >= 3 ? "#fffbeb" : "#fff1f2";
  const ratingBorder = rating >= 4 ? "#bbf7d0" : rating >= 3 ? "#fde68a" : "#fecaca";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-review-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 18px;
          border: 1.5px solid #ede9fe;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(124,58,237,0.06);
        }

        .jd-review-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 8px 32px rgba(124,58,237,0.12);
          transform: translateY(-2px);
        }

        .jd-review-top {
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid #f3f0ff;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .jd-review-headline {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1e1b4b;
          margin: 0 0 3px;
        }

        .jd-review-meta {
          font-size: 0.78rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .jd-review-meta-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #cbd5e1;
          display: inline-block;
        }

        .jd-rating-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0.85rem;
          border-radius: 12px;
          border: 1.5px solid;
          flex-shrink: 0;
          min-width: 60px;
        }

        .jd-rating-number {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1;
        }

        .jd-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #f3f0ff;
        }

        .jd-tag {
          font-size: 0.73rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 99px;
          border: 1px solid;
        }

        .jd-tag-gray   { background:#f8fafc; color:#475569; border-color:#e2e8f0; }
        .jd-tag-violet { background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; }
        .jd-tag-green  { background:#f0fdf4; color:#15803d; border-color:#bbf7d0; }

        .jd-sub-ratings {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem 1.5rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f3f0ff;
        }

        .jd-sub-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jd-sub-label {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          min-width: 80px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .jd-sub-score {
          font-size: 0.72rem;
          font-weight: 700;
          color: #7c3aed;
          min-width: 24px;
          text-align: right;
        }

        .jd-review-body {
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          border-bottom: 1px solid #f3f0ff;
        }

        .jd-review-section-label {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 3px;
        }

        .jd-review-section-text {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        .jd-pros-label  { color: #16a34a; }
        .jd-cons-label  { color: #dc2626; }
        .jd-advice-label{ color: #7c3aed; }

        .jd-pros-block  { border-left: 3px solid #bbf7d0; padding-left: 0.75rem; }
        .jd-cons-block  { border-left: 3px solid #fecaca; padding-left: 0.75rem; }
        .jd-advice-block{ border-left: 3px solid #ddd6fe; padding-left: 0.75rem; }

        .jd-review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.5rem;
          background: #faf9ff;
        }

        .jd-posted-date {
          font-size: 0.75rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .jd-helpful-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.4rem 0.875rem;
          border-radius: 8px;
          border: 1.5px solid;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .jd-helpful-btn.active {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          border-color: #7c3aed;
          box-shadow: 0 4px 12px rgba(124,58,237,0.25);
        }

        .jd-helpful-btn.inactive {
          background: white;
          color: #64748b;
          border-color: #e2e8f0;
        }

        .jd-helpful-btn.inactive:hover {
          border-color: #7c3aed;
          color: #7c3aed;
          background: #f5f3ff;
        }
      `}</style>

      <article className="jd-review-card">

        {/* Top: headline + rating badge */}
        <div className="jd-review-top">
          <div>
            <p className="jd-review-headline">{review.headline || "Employee Review"}</p>
            <div className="jd-review-meta">
              <span>{review.isAnonymous ? "Anonymous" : review.user?.name || "User"}</span>
              <span className="jd-review-meta-dot" />
              <span>{review.role || "Role not specified"}</span>
            </div>
          </div>
          <div className="jd-rating-badge" style={{ color: ratingColor, background: ratingBg, borderColor: ratingBorder }}>
            <span className="jd-rating-number" style={{ color: ratingColor }}>
              {rating.toFixed(1)}
            </span>
            <StarRating value={rating} />
          </div>
        </div>

        {/* Tags */}
        <div className="jd-tags">
          {!!review.employmentStatus && (
            <span className="jd-tag jd-tag-gray">{review.employmentStatus}</span>
          )}
          {review.recommends !== null && review.recommends !== undefined && (
            <span className="jd-tag jd-tag-violet">
              {review.recommends ? "✓ Recommends" : "✗ Doesn't Recommend"}
            </span>
          )}
          {!!review.ceoApproval && (
            <span className="jd-tag jd-tag-green">CEO: {review.ceoApproval}</span>
          )}
        </div>

        {/* Sub-ratings */}
        <div className="jd-sub-ratings">
          {subRows.map(({ key, label, icon }) => (
            <div key={key} className="jd-sub-row">
              <span className="jd-sub-label">
                <span>{icon}</span>{label}
              </span>
              <MiniBar value={review.subRatings?.[key]} />
              <span className="jd-sub-score">{Number(review.subRatings?.[key] || 0).toFixed(1)}</span>
            </div>
          ))}
        </div>

        {/* Pros / Cons / Advice */}
        <div className="jd-review-body">
          <div className="jd-pros-block">
            <p className="jd-review-section-label jd-pros-label">👍 Pros</p>
            <p className="jd-review-section-text">{review.pros || "—"}</p>
          </div>
          <div className="jd-cons-block">
            <p className="jd-review-section-label jd-cons-label">👎 Cons</p>
            <p className="jd-review-section-text">{review.cons || "—"}</p>
          </div>
          <div className="jd-advice-block">
            <p className="jd-review-section-label jd-advice-label">💡 Advice to Management</p>
            <p className="jd-review-section-text">{review.advice || "—"}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="jd-review-footer">
          <span className="jd-posted-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => onHelpful(review._id)}
            className={`jd-helpful-btn ${review.userHelpful ? "active" : "inactive"}`}
          >
            <ThumbsUp size={13} />
            Helpful ({review.helpfulCount || 0})
          </button>
        </div>

      </article>
    </>
  );
};

export default ReviewCard;