import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CalendarDays, BriefcaseBusiness, UserRound, MapPin, Video, NotebookPen } from "lucide-react";

const interviewStatusConfig = {
  scheduled:  { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Scheduled" },
  completed:  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Completed" },
  cancelled:  { bg: "#fff1f2", color: "#dc2626", border: "#fecaca", label: "Cancelled"  },
};

const getStatusStyle = (status) =>
  interviewStatusConfig[status?.toLowerCase()] || { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: status || "Unknown" };

const ApplicantMyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyInterviews = async () => {
      setLoading(true); setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/interviews/my-interviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInterviews(res.data);
      } catch (err) {
        console.error("Failed to fetch interviews:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load your interviews.");
        toast.error(err.response?.data?.error || "Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMyInterviews();
    else { setError("Please log in to view your interviews."); setLoading(false); }
  }, [token]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-iv { font-family:'DM Sans',sans-serif; max-width:960px; margin:0 auto; padding:2rem 1rem; }

        .jd-iv-hero {
          background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);
          border-radius:20px; padding:2rem;
          margin-bottom:2rem;
          display:flex; align-items:center; gap:1rem; flex-wrap:wrap;
          box-shadow:0 8px 32px rgba(124,58,237,0.25);
          position:relative; overflow:hidden;
        }
        .jd-iv-hero::before {
          content:''; position:absolute; top:-50px; right:-50px;
          width:200px; height:200px; border-radius:50%;
          background:rgba(255,255,255,0.06);
        }
        .jd-iv-hero-icon {
          width:52px; height:52px; border-radius:14px; flex-shrink:0;
          background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25);
          display:flex; align-items:center; justify-content:center;
        }
        .jd-iv-hero-title {
          font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800;
          color:white; margin:0 0 3px;
        }
        .jd-iv-hero-sub { font-size:0.85rem; color:#c4b5fd; margin:0; }
        .jd-iv-hero-badge {
          margin-left:auto; background:rgba(255,255,255,0.15);
          border:1px solid rgba(255,255,255,0.25); border-radius:99px;
          padding:0.35rem 1rem; font-size:0.8rem; font-weight:700;
          color:white; white-space:nowrap; backdrop-filter:blur(4px); z-index:1;
        }

        /* Card */
        .jd-iv-card {
          background:white; border:1.5px solid #ede9fe;
          border-radius:18px; overflow:hidden;
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
          transition:all 0.3s ease; display:flex; flex-direction:column;
        }
        .jd-iv-card:hover {
          border-color:#7c3aed; transform:translateY(-3px);
          box-shadow:0 10px 30px rgba(124,58,237,0.13);
        }

        /* Card top colour strip based on mode */
        .jd-iv-card-strip {
          height:4px;
          background:linear-gradient(90deg,#7c3aed,#4f46e5);
        }
        .jd-iv-card-strip.online  { background:linear-gradient(90deg,#7c3aed,#4f46e5); }
        .jd-iv-card-strip.offline { background:linear-gradient(90deg,#10b981,#059669); }

        .jd-iv-card-body { padding:1.25rem; flex:1; display:flex; flex-direction:column; gap:0.5rem; }

        .jd-iv-job-title {
          font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:700;
          color:#1e1b4b; margin:0 0 3px;
          display:flex; align-items:center; gap:7px;
        }

        .jd-iv-mode-badge {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.72rem; font-weight:700; padding:0.22rem 0.65rem;
          border-radius:99px; border:1.5px solid;
        }

        .jd-iv-row {
          display:flex; align-items:flex-start; gap:7px;
          font-size:0.82rem; color:#475569; line-height:1.5;
        }

        .jd-iv-notes {
          background:#f5f3ff; border:1px solid #ede9fe;
          border-radius:10px; padding:0.625rem 0.75rem;
          font-size:0.8rem; color:#4b5563; line-height:1.6;
          display:flex; align-items:flex-start; gap:7px;
        }

        .jd-iv-footer {
          padding:0.875rem 1.25rem;
          background:#faf9ff; border-top:1px solid #f3f0ff;
          display:flex; align-items:center; justify-content:space-between; gap:0.5rem; flex-wrap:wrap;
        }

        .jd-iv-recruiter { font-size:0.78rem; color:#64748b; display:flex; align-items:center; gap:5px; }
        .jd-iv-recruiter strong { color:#374151; }

        .jd-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.72rem; font-weight:700;
          padding:0.25rem 0.75rem; border-radius:99px; border:1.5px solid;
        }

        /* Date box */
        .jd-iv-date-box {
          background:linear-gradient(135deg,#f5f3ff,#ede9fe);
          border:1.5px solid #ddd6fe; border-radius:12px;
          padding:0.625rem 0.875rem;
          display:flex; align-items:center; gap:8px;
          margin-bottom:0.25rem;
        }
        .jd-iv-date-main { font-family:'Syne',sans-serif; font-size:0.9rem; font-weight:700; color:#1e1b4b; }
        .jd-iv-date-sub  { font-size:0.75rem; color:#7c3aed; }

        /* Skeleton */
        .jd-skeleton {
          background:linear-gradient(90deg,#f5f3ff 25%,#ede9fe 50%,#f5f3ff 75%);
          background-size:200% 100%; animation:jdShimmer 1.4s infinite; border-radius:10px;
        }
        @keyframes jdShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .jd-empty-box {
          background:#faf9ff; border:1.5px dashed #ddd6fe; border-radius:18px;
          padding:3.5rem 2rem; text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:0.75rem;
          grid-column:1/-1;
        }
        .jd-empty-title { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; color:#1e1b4b; margin:0; }
        .jd-empty-sub   { font-size:0.85rem; color:#94a3b8; margin:0; max-width:300px; line-height:1.6; }

        .jd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.25rem; }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="jd-iv">

        {/* Hero */}
        <div className="jd-iv-hero">
          <div className="jd-iv-hero-icon" style={{ zIndex:1 }}>
            <CalendarDays size={24} color="white" />
          </div>
          <div style={{ zIndex:1 }}>
            <h2 className="jd-iv-hero-title">My Interviews</h2>
            <p className="jd-iv-hero-sub">All your scheduled interviews at a glance</p>
          </div>
          {!loading && (
            <span className="jd-iv-hero-badge">
              {interviews.length} interview{interviews.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="jd-grid">
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ background:"white", borderRadius:18, border:"1.5px solid #ede9fe", overflow:"hidden" }}>
                <div style={{ height:4, background:"#ede9fe" }} />
                <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="jd-skeleton" style={{ height:20, width:"70%" }} />
                  <div className="jd-skeleton" style={{ height:48, borderRadius:12 }} />
                  <div className="jd-skeleton" style={{ height:13, width:"55%" }} />
                  <div className="jd-skeleton" style={{ height:13, width:"45%" }} />
                </div>
                <div style={{ padding:"0.875rem 1.25rem", background:"#faf9ff", borderTop:"1px solid #f3f0ff", display:"flex", justifyContent:"space-between" }}>
                  <div className="jd-skeleton" style={{ height:13, width:"50%" }} />
                  <div className="jd-skeleton" style={{ height:22, width:"25%", borderRadius:99 }} />
                </div>
              </div>
            ))}
          </div>

        ) : error ? (
          <div className="jd-empty-box">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" style={{ animation:"jdFloat 3s ease-in-out infinite" }}>
              <circle cx="40" cy="40" r="30" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
              <path d="M40 28v14" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="40" cy="50" r="2.5" fill="#a78bfa"/>
            </svg>
            <p className="jd-empty-title">Something went wrong</p>
            <p className="jd-empty-sub">{error}</p>
          </div>

        ) : interviews.length === 0 ? (
          <div className="jd-empty-box">
            <svg width="72" height="72" viewBox="0 0 80 80" fill="none" style={{ animation:"jdFloat 3s ease-in-out infinite" }}>
              <rect x="10" y="14" width="56" height="52" rx="10" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
              <rect x="10" y="14" width="56" height="18" rx="10" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="2"/>
              <rect x="10" y="26" width="56" height="6" fill="#ddd6fe"/>
              <line x1="26" y1="10" x2="26" y2="20" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
              <line x1="54" y1="10" x2="54" y2="20" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="30" cy="48" r="5" fill="#c4b5fd"/>
              <circle cx="50" cy="48" r="5" fill="#c4b5fd"/>
              <circle cx="30" cy="60" r="5" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
            </svg>
            <p className="jd-empty-title">No interviews scheduled yet</p>
            <p className="jd-empty-sub">Keep an eye on your applications! Recruiters might schedule an interview soon.</p>
          </div>

        ) : (
          <div className="jd-grid">
            {interviews.map((interview) => {
              const ss  = getStatusStyle(interview.status);
              const dt  = new Date(interview.date);
              const isOnline = interview.mode === "online";
              return (
                <li key={interview._id} className="jd-iv-card" style={{ listStyle:"none" }}>

                  {/* Top colour strip */}
                  <div className={`jd-iv-card-strip ${isOnline ? "online" : "offline"}`} />

                  <div className="jd-iv-card-body">

                    {/* Job title + mode badge */}
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.5rem" }}>
                      <h3 className="jd-iv-job-title">
                        <BriefcaseBusiness size={15} color="#a78bfa" />
                        {interview.job?.title || "N/A Job Title"}
                      </h3>
                      <span className="jd-iv-mode-badge" style={
                        isOnline
                          ? { background:"#f5f3ff", color:"#6d28d9", borderColor:"#ddd6fe" }
                          : { background:"#f0fdf4", color:"#15803d", borderColor:"#bbf7d0" }
                      }>
                        {isOnline ? <Video size={11}/> : <MapPin size={11}/>}
                        {isOnline ? "Online" : "In-person"}
                      </span>
                    </div>

                    {/* Date box */}
                    <div className="jd-iv-date-box">
                      <CalendarDays size={18} color="#7c3aed" />
                      <div>
                        <p className="jd-iv-date-main">{dt.toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</p>
                        <p className="jd-iv-date-sub">{dt.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}</p>
                      </div>
                    </div>

                    {/* Location */}
                    {interview.location && (
                      <div className="jd-iv-row">
                        <MapPin size={13} color="#a78bfa" style={{ flexShrink:0, marginTop:2 }} />
                        <span>{interview.location}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {interview.notes && (
                      <div className="jd-iv-notes">
                        <NotebookPen size={13} color="#a78bfa" style={{ flexShrink:0, marginTop:2 }} />
                        <span>{interview.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer — recruiter + status */}
                  <div className="jd-iv-footer">
                    <div className="jd-iv-recruiter">
                      <UserRound size={13} color="#a78bfa" />
                      <span>
                        <strong>{interview.recruiter?.name || "N/A"}</strong>
                        {interview.recruiter?.email ? ` · ${interview.recruiter.email}` : ""}
                      </span>
                    </div>
                    <span className="jd-status-pill" style={{ background:ss.bg, color:ss.color, borderColor:ss.border }}>
                      {ss.label}
                    </span>
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

export default ApplicantMyInterviews;