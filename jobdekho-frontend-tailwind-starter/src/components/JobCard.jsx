// src/components/JobCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CompanyLogo = ({ logo, company }) => {
  const [imgError, setImgError] = useState(false);
  const initial = company?.charAt(0).toUpperCase() || "J";

  return (
    <div className="jd-card-logo">
      {logo && !imgError ? (
        <img
          src={logo}
          alt={`${company} logo`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};

const JobCard = ({ job, user }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #ede9fe;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: default;
        }

        .jd-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.13), 0 2px 8px rgba(124,58,237,0.07);
          transform: translateY(-3px);
        }

        .jd-card-accent {
          position: absolute;
          top: 0; left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #7c3aed, #4f46e5);
          border-radius: 16px 0 0 16px;
          transition: width 0.3s ease;
        }

        .jd-card:hover .jd-card-accent {
          width: 6px;
        }

        .jd-card-logo {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          color: #7c3aed;
          flex-shrink: 0;
          overflow: hidden;
          border: 1.5px solid #ede9fe;
          box-shadow: 0 2px 8px rgba(124,58,237,0.10);
        }

        .jd-card-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .jd-card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1e1b4b;
          line-height: 1.3;
          margin: 0;
        }

        .jd-card-company {
          font-size: 0.85rem;
          font-weight: 600;
          color: #7c3aed;
          margin: 0;
        }

        .jd-card-location {
          font-size: 0.8rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .jd-card-desc {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0.75rem 0;
          border-left: 2px solid #ede9fe;
          padding-left: 0.75rem;
        }

        .jd-salary-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          border-radius: 99px;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
        }

        .jd-card-divider {
          height: 1px;
          background: linear-gradient(90deg, #ede9fe, transparent);
          margin: 1rem 0;
        }

        .jd-btn-view {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          font-weight: 600;
          font-size: 0.83rem;
          padding: 0.5rem 1.1rem;
          border-radius: 8px;
          border: none;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
          letter-spacing: 0.01em;
        }

        .jd-btn-view:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.38);
          color: white;
          text-decoration: none;
        }

        .jd-btn-apply {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: #7c3aed;
          font-weight: 600;
          font-size: 0.83rem;
          padding: 0.48rem 1.1rem;
          border-radius: 8px;
          border: 1.5px solid #c4b5fd;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .jd-btn-apply:hover {
          background: #f5f3ff;
          border-color: #7c3aed;
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="jd-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Left accent bar */}
        <div className="jd-card-accent" />

        {/* Header Row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", paddingLeft: "0.5rem" }}>

          {/* Company Logo — shows image if job.companyLogo exists, else shows initial */}
          <CompanyLogo logo={job.companyLogo} company={job.company} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="jd-card-title">{job.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginTop: "2px" }}>
              <p className="jd-card-company">{job.company}</p>
              <span style={{ color: "#cbd5e1", fontSize: "0.75rem" }}>•</span>
              <span className="jd-card-location">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="jd-card-desc" style={{ paddingLeft: "0.5rem" }}>
          {job.description?.slice(0, 100)}...
        </p>

        {/* Salary */}
        <div style={{ paddingLeft: "0.5rem" }}>
          <span className="jd-salary-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            {job.salary}
          </span>
        </div>

        <div className="jd-card-divider" />

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", paddingLeft: "0.5rem" }}>
          <Link to={`/jobs/${job._id}`} className="jd-btn-view">
            View Details
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {user?.role === "jobseeker" && (
            <button
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="jd-btn-apply"
            >
              Apply Now
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default JobCard;