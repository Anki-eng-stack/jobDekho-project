import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, BriefcaseBusiness, CalendarDays, Video, MapPin,
  Loader2, Hourglass, CheckCircle, XCircle, ClipboardCheck,
  CalendarCheck2, NotebookPen
} from "lucide-react";

const statusConfig = {
  applied:              { label: "Applied",              bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", icon: <Hourglass size={13}/> },
  reviewed:             { label: "Reviewed",             bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe", icon: <ClipboardCheck size={13}/> },
  shortlisted:          { label: "Shortlisted",          bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", icon: <CheckCircle size={13}/> },
  rejected:             { label: "Rejected",             bg: "#fff1f2", color: "#dc2626", border: "#fecaca", icon: <XCircle size={13}/> },
  interview_scheduled:  { label: "Interview Scheduled",  bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe", icon: <CalendarDays size={13}/> },
  hired:                { label: "Hired 🎉",              bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4", icon: <CheckCircle size={13}/> },
  cancelled:            { label: "Cancelled",            bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", icon: <XCircle size={13}/> },
};

const getStatusInfo = (status) =>
  statusConfig[status?.toLowerCase()] || { label: status || "Unknown", bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", icon: null };

const ApplicantMyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyApplications = async () => {
      setLoading(true); setError(null);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("ApplicantMyApplications - API Response Data:", res.data);
        setApplications(res.data.applications);
        console.log("ApplicantMyApplications - Applications state after update:", res.data.applications);
        toast.success("My applications loaded successfully!");
      } catch (err) {
        console.error("ApplicantMyApplications - Failed to fetch:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load your applications.");
        toast.error(err.response?.data?.error || "Failed to load applications.");
        if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMyApplications();
    else {
      setLoading(false);
      setError("Please log in to view your applications.");
      toast.info("Please log in to view your applications.");
      navigate("/login");
    }
  }, [token, navigate]);

  console.log("ApplicantMyApplications - Current applications state in render:", applications);
  console.log("ApplicantMyApplications - Is loading:", loading);
  console.log("ApplicantMyApplications - Has error:", error);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-apps { font-family: 'DM Sans', sans-serif; max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }

        .jd-apps-hero {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          border-radius: 20px;
          padding: 2rem 2rem;
          margin-bottom: 2rem;
          display: flex; align-items: center; gap: 1rem;
          box-shadow: 0 8px 32px rgba(124,58,237,0.25);
          position: relative; overflow: hidden;
        }
        .jd-apps-hero::before {
          content:''; position:absolute; top:-50px; right:-50px;
          width:200px; height:200px; border-radius:50%;
          background:rgba(255,255,255,0.06);
        }
        .jd-apps-hero-icon {
          width:52px; height:52px; border-radius:14px;
          background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .jd-apps-hero-title {
          font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800;
          color:white; margin:0 0 3px;
        }
        .jd-apps-hero-sub { font-size:0.85rem; color:#c4b5fd; margin:0; }
        .jd-apps-hero-badge {
          margin-left:auto; background:rgba(255,255,255,0.15);
          border:1px solid rgba(255,255,255,0.25); border-radius:99px;
          padding:0.35rem 1rem; font-size:0.8rem; font-weight:700;
          color:white; white-space:nowrap; backdrop-filter:blur(4px);
        }

        /* App card */
        .jd-app-card {
          background:white; border:1.5px solid #ede9fe;
          border-radius:18px; overflow:hidden;
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
          transition:all 0.3s ease; display:flex; flex-direction:column;
        }
        .jd-app-card:hover {
          border-color:#7c3aed; transform:translateY(-3px);
          box-shadow:0 10px 30px rgba(124,58,237,0.13);
        }

        .jd-app-card-top {
          padding:1.25rem 1.25rem 0.875rem;
          border-bottom:1px solid #f3f0ff;
        }

        .jd-app-title {
          font-family:'Syne',sans-serif; font-weight:700;
          font-size:1rem; color:#1e1b4b; margin:0 0 5px;
          display:flex; align-items:center; gap:6px;
        }
        .jd-app-company { font-size:0.82rem; color:#7c3aed; font-weight:600; margin:0 0 8px; }

        .jd-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.72rem; font-weight:700;
          padding:0.25rem 0.75rem; border-radius:99px; border:1.5px solid;
        }

        .jd-resume-link {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.8rem; font-weight:600; color:#7c3aed;
          text-decoration:none; margin-top:8px;
          padding:0.3rem 0.75rem; border-radius:8px;
          border:1.5px solid #ddd6fe; background:#f5f3ff;
          transition:all 0.2s;
        }
        .jd-resume-link:hover { background:#ede9fe; border-color:#7c3aed; }

        /* Interview section */
        .jd-interview {
          padding:1rem 1.25rem 1.25rem;
          background:#faf9ff;
          border-top:1px solid #f3f0ff;
          flex:1;
        }
        .jd-interview-title {
          font-family:'Syne',sans-serif; font-size:0.85rem; font-weight:700;
          color:#1e1b4b; margin:0 0 0.75rem;
          display:flex; align-items:center; gap:6px;
        }
        .jd-interview-row {
          display:flex; align-items:flex-start; gap:7px;
          font-size:0.8rem; color:#475569; margin-bottom:5px; line-height:1.5;
        }
        .jd-interview-none {
          font-size:0.8rem; color:#94a3b8; font-style:italic;
          display:flex; align-items:center; gap:6px;
        }

        /* Loading */
        .jd-skeleton {
          background:linear-gradient(90deg,#f5f3ff 25%,#ede9fe 50%,#f5f3ff 75%);
          background-size:200% 100%;
          animation:jdShimmer 1.4s infinite; border-radius:10px;
        }
        @keyframes jdShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Empty / error */
        .jd-empty-box {
          background:#faf9ff; border:1.5px dashed #ddd6fe;
          border-radius:18px; padding:3.5rem 2rem;
          text-align:center; display:flex; flex-direction:column;
          align-items:center; gap:0.75rem;
          grid-column:1/-1;
        }
        .jd-empty-title { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; color:#1e1b4b; margin:0; }
        .jd-empty-sub   { font-size:0.85rem; color:#94a3b8; margin:0; }

        .jd-browse-btn {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:10px; padding:0.65rem 1.5rem;
          cursor:pointer; text-decoration:none; display:inline-flex;
          align-items:center; gap:6px;
          box-shadow:0 4px 14px rgba(124,58,237,0.3); transition:all 0.2s;
        }
        .jd-browse-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(124,58,237,0.4); color:white; }

        .jd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.25rem; }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="jd-apps">

        {/* Hero */}
        <div className="jd-apps-hero">
          <div className="jd-apps-hero-icon">
            <BriefcaseBusiness size={24} color="white" />
          </div>
          <div style={{ zIndex: 1 }}>
            <h2 className="jd-apps-hero-title">My Applications</h2>
            <p className="jd-apps-hero-sub">Track all your job applications in one place</p>
          </div>
          {!loading && (
            <span className="jd-apps-hero-badge">
              {applications.length} application{applications.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="jd-grid">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{ background:"white", borderRadius:18, border:"1.5px solid #ede9fe", overflow:"hidden" }}>
                <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="jd-skeleton" style={{ height:20, width:"65%" }} />
                  <div className="jd-skeleton" style={{ height:13, width:"40%" }} />
                  <div className="jd-skeleton" style={{ height:24, width:"35%", borderRadius:99 }} />
                </div>
                <div style={{ padding:"1rem 1.25rem", background:"#faf9ff", borderTop:"1px solid #f3f0ff" }}>
                  <div className="jd-skeleton" style={{ height:13, width:"80%", marginBottom:8 }} />
                  <div className="jd-skeleton" style={{ height:13, width:"60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="jd-empty-box">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" style={{ animation:"jdFloat 3s ease-in-out infinite" }}>
              <circle cx="40" cy="40" r="30" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
              <path d="M40 28v14" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="40" cy="50" r="2.5" fill="#a78bfa"/>
            </svg>
            <p className="jd-empty-title">Something went wrong</p>
            <p className="jd-empty-sub">{error}</p>
            <Link to="/jobs" className="jd-browse-btn" style={{ marginTop:8 }}>
              Browse Jobs
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

        ) : applications.length === 0 ? (
          /* Empty state */
          <div className="jd-empty-box">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" style={{ animation:"jdFloat 3s ease-in-out infinite" }}>
              <rect x="14" y="12" width="44" height="56" rx="7" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="24" y1="28" x2="48" y2="28" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="24" y1="38" x2="48" y2="38" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="47" x2="38" y2="47" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="jd-empty-title">No applications yet</p>
            <p className="jd-empty-sub">You haven't applied to any jobs. Start exploring opportunities!</p>
            <Link to="/jobs" className="jd-browse-btn" style={{ marginTop:8 }}>
              Browse Jobs
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

        ) : (
          /* Applications grid */
          <div className="jd-grid">
            {applications.map((application) => {
              const si = getStatusInfo(application.status);
              return (
                <li key={application._id} className="jd-app-card" style={{ listStyle:"none" }}>

                  {/* Top section */}
                  <div className="jd-app-card-top">
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.5rem" }}>
                      <div style={{ flex:1 }}>
                        <h3 className="jd-app-title">
                          <BriefcaseBusiness size={15} color="#a78bfa" />
                          {application.job?.title || "Job Title N/A"}
                        </h3>
                        <p className="jd-app-company">{application.job?.company || "N/A"}</p>
                      </div>
                      <span className="jd-status-pill" style={{ background:si.bg, color:si.color, borderColor:si.border, flexShrink:0 }}>
                        {si.icon} {si.label}
                      </span>
                    </div>

                    {application.resumeUrl && (
                      <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="jd-resume-link">
                        <FileText size={13} /> View Resume
                      </a>
                    )}
                  </div>

                  {/* Interview section */}
                  <div className="jd-interview">
                    {application.interview ? (
                      <>
                        <p className="jd-interview-title">
                          <CalendarDays size={15} color="#7c3aed" /> Interview Scheduled
                        </p>
                        <div className="jd-interview-row">
                          <CalendarCheck2 size={13} color="#a78bfa" style={{ flexShrink:0, marginTop:1 }} />
                          <span>{new Date(application.interview.date).toLocaleString()}</span>
                        </div>
                        <div className="jd-interview-row">
                          {application.interview.mode === "online"
                            ? <Video size={13} color="#7c3aed" style={{ flexShrink:0, marginTop:1 }} />
                            : <MapPin size={13} color="#16a34a" style={{ flexShrink:0, marginTop:1 }} />
                          }
                          <span style={{ textTransform:"capitalize" }}>{application.interview.mode} interview</span>
                        </div>
                        {application.interview.location && (
                          <div className="jd-interview-row">
                            <MapPin size={13} color="#a78bfa" style={{ flexShrink:0, marginTop:1 }} />
                            <span>{application.interview.location}</span>
                          </div>
                        )}
                        {application.interview.notes && (
                          <div className="jd-interview-row" style={{ marginTop:4, background:"#f5f3ff", borderRadius:8, padding:"0.5rem 0.625rem", color:"#4b5563" }}>
                            <NotebookPen size={13} color="#a78bfa" style={{ flexShrink:0, marginTop:1 }} />
                            <span>{application.interview.notes}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="jd-interview-none">
                        <CalendarDays size={14} color="#c4b5fd" />
                        Interview not yet scheduled
                      </p>
                    )}
                  </div>

                </li>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicantMyApplications;