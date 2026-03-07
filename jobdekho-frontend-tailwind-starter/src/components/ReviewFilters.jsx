import React from "react";

const ReviewFilters = ({ filters, onChange, onReset }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-filters-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 18px;
          border: 1.5px solid #ede9fe;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(124,58,237,0.07);
        }

        .jd-filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid #f3f0ff;
          background: linear-gradient(135deg, #faf9ff 0%, #f5f3ff 100%);
        }

        .jd-filters-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1e1b4b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }

        .jd-filters-title-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
        }

        .jd-reset-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #7c3aed;
          background: white;
          border: 1.5px solid #ddd6fe;
          border-radius: 8px;
          padding: 0.35rem 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .jd-reset-btn:hover {
          background: #f5f3ff;
          border-color: #7c3aed;
        }

        .jd-filters-body {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
        }

        .jd-filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .jd-filter-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          padding-left: 2px;
        }

        .jd-filter-input,
        .jd-filter-select {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #1e1b4b;
          background: #faf9ff;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          padding: 0.55rem 0.875rem;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
        }

        .jd-filter-input::placeholder {
          color: #c4b5fd;
        }

        .jd-filter-input:focus,
        .jd-filter-select:focus {
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .jd-select-wrapper {
          position: relative;
        }

        .jd-select-wrapper::after {
          content: '';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #7c3aed;
          pointer-events: none;
        }
      `}</style>

      <section className="jd-filters-card">
        {/* Header */}
        <div className="jd-filters-header">
          <h3 className="jd-filters-title">
            <span className="jd-filters-title-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </span>
            Filter Reviews
          </h3>
          <button type="button" onClick={onReset} className="jd-reset-btn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Reset
          </button>
        </div>

        {/* Filter Fields */}
        <div className="jd-filters-body">

          {/* Role */}
          <div className="jd-filter-group">
            <label className="jd-filter-label">Role</label>
            <input
              name="role"
              value={filters.role}
              onChange={onChange}
              placeholder="e.g. Software Engineer"
              className="jd-filter-input"
            />
          </div>

          {/* Rating */}
          <div className="jd-filter-group">
            <label className="jd-filter-label">Min Rating</label>
            <div className="jd-select-wrapper">
              <select name="rating" value={filters.rating} onChange={onChange} className="jd-filter-select">
                <option value="">Any Rating</option>
                <option value="4">⭐ 4+</option>
                <option value="3">⭐ 3+</option>
                <option value="2">⭐ 2+</option>
                <option value="1">⭐ 1+</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="jd-filter-group">
            <label className="jd-filter-label">Sort By</label>
            <div className="jd-select-wrapper">
              <select name="sort" value={filters.sort} onChange={onChange} className="jd-filter-select">
                <option value="newest">🕐 Newest</option>
                <option value="oldest">🕰 Oldest</option>
                <option value="highest">⬆️ Highest Rating</option>
                <option value="lowest">⬇️ Lowest Rating</option>
                <option value="helpful">👍 Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="jd-filter-group">
            <label className="jd-filter-label">Location</label>
            <input
              name="location"
              value={filters.location}
              onChange={onChange}
              placeholder="e.g. Mumbai"
              className="jd-filter-input"
            />
          </div>

          {/* Employment Status */}
          <div className="jd-filter-group">
            <label className="jd-filter-label">Employment</label>
            <div className="jd-select-wrapper">
              <select name="employmentStatus" value={filters.employmentStatus} onChange={onChange} className="jd-filter-select">
                <option value="">All Status</option>
                <option value="Current">🟢 Current</option>
                <option value="Former">🔴 Former</option>
              </select>
            </div>
          </div>

          {/* Recommends */}
          <div className="jd-filter-group">
            <label className="jd-filter-label">Recommends</label>
            <div className="jd-select-wrapper">
              <select name="recommends" value={filters.recommends} onChange={onChange} className="jd-filter-select">
                <option value="">All</option>
                <option value="true">✓ Yes</option>
                <option value="false">✗ No</option>
              </select>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default ReviewFilters;