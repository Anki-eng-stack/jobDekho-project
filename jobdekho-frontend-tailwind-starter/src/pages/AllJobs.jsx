import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BriefcaseBusiness, Building2, MapPin, IndianRupee, Search, SlidersHorizontal } from "lucide-react";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await axios.get("http://localhost:5000/api/jobs");
        let availableJobs = jobsRes.data;

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const applicationsRes = await axios.get("http://localhost:5000/api/applications/my", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const appliedJobIds = new Set(
              (applicationsRes.data.applications || [])
                .map((app) => app.jobId || app.job?._id)
                .filter(Boolean)
            );
            availableJobs = jobsRes.data.filter((job) => !appliedJobIds.has(job._id));
          } catch (applicationErr) {
            console.warn("Failed to fetch applications for filtering jobs:", applicationErr);
          }
        }
        setJobs(availableJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-alljobs { font-family: 'DM Sans', sans-serif; }

        /* Hero banner */
        .jd-hero {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          border-radius: 20px;
          padding: 2.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
          box-shadow: 0 8px 32px rgba(124,58,237,0.25);
          position: relative;
          overflow: hidden;
        }

        .jd-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .jd-hero::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 30%;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .jd-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jd-hero-sub {
          font-size: 0.9rem;
          color: #c4b5fd;
          margin: 0;
        }

        .jd-hero-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 99px;
          padding: 0.35rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          backdrop-filter: blur(4px);
          white-space: nowrap;
        }

        /* Search bar */
        .jd-search-wrap {
          position: relative;
          flex: 1;
          max-width: 420px;
        }

        .jd-search-input {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          padding: 0.65rem 1rem 0.65rem 2.6rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .jd-search-input::placeholder { color: rgba(255,255,255,0.55); }
        .jd-search-input:focus {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
        }

        .jd-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.7);
          pointer-events: none;
        }

        /* Job card */
        .jd-job-card {
          background: white;
          border: 1.5px solid #ede9fe;
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(124,58,237,0.06);
        }

        .jd-job-card:hover {
          border-color: #7c3aed;
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(124,58,237,0.14);
        }

        .jd-job-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
        }

        .jd-job-img-placeholder {
          width: 100%;
          height: 160px;
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 6px;
          color: #a78bfa;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .jd-job-body {
          padding: 1.1rem 1.25rem 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0;
        }

        .jd-job-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e1b4b;
          margin: 0 0 0.5rem;
          line-height: 1.3;
        }

        .jd-job-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 3px;
        }

        .jd-job-desc {
          font-size: 0.82rem;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0.625rem 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .jd-salary {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          border-radius: 99px;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.2rem 0.7rem;
          margin-bottom: 0.875rem;
        }

        .jd-view-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          border-radius: 10px;
          padding: 0.65rem 1rem;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(124,58,237,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .jd-view-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(124,58,237,0.38);
        }

        /* Skeleton loader */
        .jd-skeleton {
          background: linear-gradient(90deg, #f5f3ff 25%, #ede9fe 50%, #f5f3ff 75%);
          background-size: 200% 100%;
          animation: jdShimmer 1.4s infinite;
          border-radius: 10px;
        }

        @keyframes jdShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty */
        .jd-empty-box {
          background: #faf9ff;
          border: 1.5px dashed #ddd6fe;
          border-radius: 18px;
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .jd-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e1b4b;
          margin: 0;
        }

        .jd-empty-sub {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0;
        }
      `}</style>

      <section className="jd-alljobs" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Hero */}
        <div className="jd-hero">
          <div style={{ zIndex: 1 }}>
            <h1 className="jd-hero-title">
              <BriefcaseBusiness size={26} color="white" />
              Discover Jobs
            </h1>
            <p className="jd-hero-sub">Explore opportunities that match your profile.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", zIndex: 1 }}>
            {/* Search inside hero */}
            <div className="jd-search-wrap">
              <Search size={15} className="jd-search-icon" />
              <input
                className="jd-search-input"
                placeholder="Search jobs, companies, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {!loading && (
              <span className="jd-hero-badge">
                {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{ background: "white", borderRadius: 18, border: "1.5px solid #ede9fe", overflow: "hidden" }}>
                <div className="jd-skeleton" style={{ height: 160, borderRadius: 0 }} />
                <div style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="jd-skeleton" style={{ height: 18, width: "70%" }} />
                  <div className="jd-skeleton" style={{ height: 13, width: "50%" }} />
                  <div className="jd-skeleton" style={{ height: 13, width: "40%" }} />
                  <div className="jd-skeleton" style={{ height: 36, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="jd-empty-box">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" style={{ animation: "jdFloat 3s ease-in-out infinite" }}>
              <circle cx="36" cy="36" r="22" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2.5"/>
              <line x1="52" y1="52" x2="68" y2="68" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round"/>
              <line x1="28" y1="36" x2="44" y2="36" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="36" y1="28" x2="36" y2="44" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <p className="jd-empty-title">{search ? "No jobs match your search" : "No jobs available right now"}</p>
            <p className="jd-empty-sub">{search ? "Try different keywords" : "Please check back later."}</p>
            {search && (
              <button onClick={() => setSearch("")} style={{
                marginTop: 4, fontSize: "0.82rem", fontWeight: 600, color: "#7c3aed",
                background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 8,
                padding: "0.4rem 1rem", cursor: "pointer"
              }}>Clear Search</button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.25rem" }}>
            {filtered.map((job) => (
              <article key={job._id} className="jd-job-card">
                {/* Image */}
                {job.jobImage?.url ? (
                  <img
                    src={job.jobImage.url}
                    alt={job.title}
                    className="jd-job-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x200/E0E7FF/6366F1?text=Job+Image";
                    }}
                  />
                ) : (
                  <div className="jd-job-img-placeholder">
                    <BriefcaseBusiness size={32} color="#c4b5fd" />
                    <span>No image available</span>
                  </div>
                )}

                <div className="jd-job-body">
                  <h2 className="jd-job-title">{job.title}</h2>

                  <div className="jd-job-meta">
                    <Building2 size={13} color="#a78bfa" />
                    <span>{job.company || "N/A"}</span>
                  </div>
                  <div className="jd-job-meta">
                    <MapPin size={13} color="#a78bfa" />
                    <span>{job.location || "N/A"}</span>
                  </div>

                  <p className="jd-job-desc">{job.description || "No description available."}</p>

                  <span className="jd-salary">
                    <IndianRupee size={11} />
                    {job.salary ? Number(job.salary).toLocaleString("en-IN") : "Not mentioned"}
                  </span>

                  <button className="jd-view-btn" onClick={() => navigate(`/jobs/${job._id}`)}>
                    View Details
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <style>{`@keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </>
  );
};

export default AllJobs;