import React from "react";

const rows = [
  { key: "workCulture",    label: "Work Culture",      icon: "🏢" },
  { key: "salaryBenefits", label: "Salary & Benefits", icon: "💰" },
  { key: "workLifeBalance",label: "Work Life Balance",  icon: "⚖️" },
  { key: "management",     label: "Management",         icon: "👔" },
  { key: "careerGrowth",   label: "Career Growth",      icon: "📈" },
];

const StarBar = ({ value }) => {
  const safe = Math.max(0, Math.min(5, Number(value) || 0));
  const percent = (safe / 5) * 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
      {/* Bar track */}
      <div style={{
        flex: 1,
        height: "8px",
        borderRadius: "99px",
        background: "#ede9fe",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          borderRadius: "99px",
          background: percent >= 80
            ? "linear-gradient(90deg, #7c3aed, #4f46e5)"
            : percent >= 60
            ? "linear-gradient(90deg, #a78bfa, #7c3aed)"
            : percent >= 40
            ? "linear-gradient(90deg, #f59e0b, #f97316)"
            : "linear-gradient(90deg, #f87171, #ef4444)",
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>

      {/* Star icons */}
      <div style={{ display: "flex", gap: "2px" }}>
        {[1,2,3,4,5].map((star) => {
          const filled = safe >= star;
          const half = !filled && safe >= star - 0.5;
          return (
            <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : half ? "url(#half)" : "none"} stroke={filled || half ? "#f59e0b" : "#d1d5db"} strokeWidth="1.5">
              {half && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="#f59e0b"/>
                    <stop offset="50%" stopColor="transparent"/>
                  </linearGradient>
                </defs>
              )}
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
          );
        })}
      </div>
    </div>
  );
};

const RatingSummary = ({ summary }) => {
  const overall = rows.reduce((acc, r) => acc + (Number(summary?.[r.key]) || 0), 0) / rows.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-rating-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 20px;
          border: 1.5px solid #ede9fe;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(124,58,237,0.08);
        }

        .jd-rating-header {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .jd-rating-header-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .jd-rating-header-sub {
          font-size: 0.78rem;
          color: #c4b5fd;
          margin-top: 2px;
        }

        .jd-overall-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 0.6rem 1rem;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
        }

        .jd-overall-number {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .jd-overall-label {
          font-size: 0.7rem;
          color: #e0d9ff;
          margin-top: 2px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .jd-rating-body {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .jd-rating-row {
          display: grid;
          grid-template-columns: 180px 1fr 42px;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .jd-rating-row:hover {
          background: #f5f3ff;
        }

        .jd-rating-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
        }

        .jd-rating-label-icon {
          font-size: 1rem;
          line-height: 1;
        }

        .jd-rating-score {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #7c3aed;
          text-align: right;
        }
      `}</style>

      <div className="jd-rating-card">
        {/* Header */}
        <div className="jd-rating-header">
          <div>
            <h3 className="jd-rating-header-title">Overall Rating Summary</h3>
            <p className="jd-rating-header-sub">Based on employee reviews</p>
          </div>
          <div className="jd-overall-score">
            <span className="jd-overall-number">{overall.toFixed(1)}</span>
            <span className="jd-overall-label">out of 5</span>
          </div>
        </div>

        {/* Rows */}
        <div className="jd-rating-body">
          {rows.map((item) => (
            <div key={item.key} className="jd-rating-row">
              <div className="jd-rating-label">
                <span className="jd-rating-label-icon">{item.icon}</span>
                {item.label}
              </div>
              <StarBar value={summary?.[item.key]} />
              <span className="jd-rating-score">
                {Number(summary?.[item.key] || 0).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RatingSummary;