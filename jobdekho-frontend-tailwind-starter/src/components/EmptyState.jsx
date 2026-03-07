import React from "react";

/**
 * Usage:
 * <EmptyState type="jobs" message="No jobs found" sub="Try adjusting your filters" action={{ label: "Clear Filters", onClick: onReset }} />
 *
 * types: "jobs" | "reviews" | "applications" | "chat" | "search" | "default"
 */

const illustrations = {
  jobs: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="10" y="20" width="60" height="45" rx="8" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
      <rect x="28" y="10" width="24" height="16" rx="4" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="2" />
      <line x1="22" y1="38" x2="58" y2="38" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="48" x2="50" y2="48" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="56" x2="44" y2="56" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      <circle cx="62" cy="58" r="12" fill="#7c3aed" opacity="0.15" />
      <path d="M57 58l3 3 5-5" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  reviews: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="15" width="55" height="42" rx="8" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M20 50l5-10 8 6 10-18 9 14 6-5" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="64" cy="60" r="12" fill="#7c3aed" opacity="0.12" />
      <path d="M60 60l1.5 1.5L65 57" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="29" r="4" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="1.5" />
    </svg>
  ),
  applications: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="14" y="12" width="44" height="56" rx="7" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
      <line x1="24" y1="28" x2="48" y2="28" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="38" x2="48" y2="38" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="47" x2="38" y2="47" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="58" r="13" fill="#7c3aed" />
      <path d="M54 58l4 4 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chat: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="14" width="46" height="34" rx="10" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M12 48l4-8" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      <rect x="26" y="32" width="46" height="34" rx="10" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="2" />
      <path d="M68 66l-4-8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
      <circle cx="39" cy="49" r="3" fill="#7c3aed" opacity="0.4" />
      <circle cx="49" cy="49" r="3" fill="#7c3aed" opacity="0.6" />
      <circle cx="59" cy="49" r="3" fill="#7c3aed" />
    </svg>
  ),
  search: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="36" cy="36" r="22" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2.5" />
      <line x1="52" y1="52" x2="68" y2="68" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="36" x2="44" y2="36" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="28" x2="36" y2="44" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  default: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="30" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M40 28v14" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="50" r="2.5" fill="#a78bfa" />
    </svg>
  ),
};

const EmptyState = ({ type = "default", message, sub, action }) => {
  return (
    <>
      <style>{`
        .jd-empty {
          font-family: "Manrope", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3.5rem 2rem;
          border-radius: 20px;
          border: 1.5px dashed #ddd6fe;
          background: linear-gradient(135deg, #faf9ff 0%, #f5f3ff 100%);
        }

        .jd-empty-illustration {
          animation: jdEmptyFloat 3s ease-in-out infinite;
          margin-bottom: 1.5rem;
        }

        @keyframes jdEmptyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .jd-empty-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e1b4b;
          margin: 0 0 0.4rem;
        }

        .jd-empty-sub {
          font-size: 0.875rem;
          color: #94a3b8;
          margin: 0 0 1.5rem;
          max-width: 280px;
          line-height: 1.6;
        }

        .jd-empty-btn {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.4rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(124,58,237,0.3);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .jd-empty-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124,58,237,0.4);
        }
      `}</style>

      <div className="jd-empty">
        <div className="jd-empty-illustration">{illustrations[type] || illustrations.default}</div>
        <h3 className="jd-empty-title">{message || "Nothing here yet"}</h3>
        {sub && <p className="jd-empty-sub">{sub}</p>}
        {action && (
          <button className="jd-empty-btn" onClick={action.onClick}>
            {action.label}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default EmptyState;
