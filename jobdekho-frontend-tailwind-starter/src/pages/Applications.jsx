import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText, CalendarCheck, AlertCircle, ExternalLink,
  BriefcaseBusiness, Building2, Circle, XCircle,
} from "lucide-react";

const STATUS_META = {
  applied:              { label: "Applied",              bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  shortlisted:          { label: "Shortlisted",          bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  interview_scheduled:  { label: "Interview Scheduled",  bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
  selected:             { label: "Selected 🎉",           bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  rejected:             { label: "Rejected",             bg: "#fff1f2", color: "#dc2626", border: "#fecaca" },
  withdrawn:            { label: "Withdrawn",            bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
};

const getStatus = (status) =>
  STATUS_META[status] || { label: status || "Unknown", bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };

const isWithdrawAllowed = (status) => !["selected", "rejected", "withdrawn"].includes(status);

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/applications/my");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications", err);
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;
    const socket = io("http://localhost:5000", { auth: { token } });
    socket.on("application:status-updated", () => { fetchApplications(); });
    return () => socket.disconnect();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await API.patch(`/applications/withdraw/${id}`);
      toast.success("Application withdrawn.");
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to withdraw application.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-myapps { font-family:'DM Sans',sans-serif; max-width:1100px; margin:0 auto; padding:2rem 1rem; }

        /* Hero */
        .jd-myapps-hero {
          background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);
          border-radius:20px; padding:2rem;
          margin-bottom:2rem;
          display:flex; align-items:center; gap:1rem; flex-wrap:wrap;
          box-shadow:0 8px 32px rgba(124,58,237,0.25);
          position:relative; overflow:hidden;
        }
        .jd-myapps-hero::before {
          content:''; position:absolute; top:-50px; right:-50px;
          width:200px; height:200px; border-radius:50%;
          background:rgba(255,255,255,0.06);
        }
        .jd-myapps-hero-icon {
          width:52px; height:52px; border-radius:14px; flex-shrink:0; z-index:1;
          background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25);
          display:flex; align-items:center; justify-content:center;
        }
        .jd-myapps-hero-text { z-index:1; }
        .jd-myapps-hero-title { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; color:white; margin:0 0 3px; }
        .jd-myapps-hero-sub   { font-size:0.85rem; color:#c4b5fd; margin:0; }
        .jd-myapps-hero-badge {
          margin-left:auto; z-index:1;
          background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25);
          border-radius:99px; padding:0.35rem 1rem; font-size:0.8rem;
          font-weight:700; color:white; white-space:nowrap; backdrop-filter:blur(4px);
        }

        /* Card */
        .jd-myapps-card {
          background:white; border:1.5px solid #ede9fe; border-radius:18px;
          overflow:hidden; box-shadow:0 2px 12px rgba(124,58,237,0.06);
          transition:all 0.3s ease; display:flex; flex-direction:column;
        }
        .jd-myapps-card:hover {
          border-color:#7c3aed; transform:translateY(-3px);
          box-shadow:0 10px 30px rgba(124,58,237,0.13);
        }

        .jd-myapps-card-top { padding:1.25rem 1.25rem 1rem; border-bottom:1px solid #f3f0ff; }

        .jd-myapps-job-title {
          font-family:'Syne',sans-serif; font-size:1rem; font-weight:700;
          color:#1e1b4b; margin:0 0 4px; display:flex; align-items:center; gap:6px;
        }
        .jd-myapps-company  { font-size:0.82rem; color:#7c3aed; font-weight:600; margin:0 0 8px; display:flex; align-items:center; gap:5px; }
        .jd-myapps-date     { font-size:0.75rem; color:#94a3b8; display:flex; align-items:center; gap:5px; margin-bottom:8px; }

        .jd-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.72rem; font-weight:700;
          padding:0.25rem 0.75rem; border-radius:99px; border:1.5px solid;
        }

        /* Timeline */
        .jd-timeline {
          padding:1rem 1.25rem;
          background:#faf9ff; border-bottom:1px solid #f3f0ff;
        }
        .jd-timeline-title {
          font-size:0.72rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.07em; color:#7c3aed; margin:0 0 0.75rem;
          display:flex; align-items:center; gap:6px;
        }
        .jd-timeline-title::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-timeline-item { display:flex; align-items:flex-start; gap:0.625rem; margin-bottom:0.625rem; }
        .jd-timeline-dot  {
          width:8px; height:8px; border-radius:50%;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          flex-shrink:0; margin-top:5px;
        }
        .jd-timeline-status { font-size:0.8rem; font-weight:600; color:#1e1b4b; margin:0; }
        .jd-timeline-date   { font-size:0.72rem; color:#94a3b8; margin:1px 0 0; }
        .jd-timeline-note   { font-size:0.72rem; color:#64748b; margin:1px 0 0; font-style:italic; }

        /* Actions */
        .jd-myapps-actions {
          padding:1rem 1.25rem;
          display:flex; gap:0.625rem; flex-wrap:wrap; align-items:center;
        }

        .jd-resume-link {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.78rem; font-weight:600; color:#7c3aed;
          text-decoration:none; padding:0.4rem 0.875rem;
          border-radius:8px; border:1.5px solid #ddd6fe; background:#f5f3ff;
          transition:all 0.2s;
        }
        .jd-resume-link:hover { background:#ede9fe; border-color:#7c3aed; }

        .jd-btn-primary {
          flex:1; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:9px; padding:0.55rem 0.75rem;
          cursor:pointer; transition:all 0.2s;
          box-shadow:0 3px 10px rgba(124,58,237,0.22);
          display:flex; align-items:center; justify-content:center; gap:5px;
          min-width:0;
        }
        .jd-btn-primary:hover { transform:translateY(-1px); box-shadow:0 5px 16px rgba(124,58,237,0.35); }

        .jd-btn-secondary {
          flex:1; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:700;
          color:#7c3aed; background:white;
          border:1.5px solid #ddd6fe; border-radius:9px; padding:0.55rem 0.75rem;
          cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:5px;
          min-width:0;
        }
        .jd-btn-secondary:hover { background:#f5f3ff; border-color:#7c3aed; }

        .jd-btn-danger {
          flex:1; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:700;
          color:#dc2626; background:white;
          border:1.5px solid #fecaca; border-radius:9px; padding:0.55rem 0.75rem;
          cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:5px;
          min-width:0;
        }
        .jd-btn-danger:hover { background:#fff1f2; border-color:#dc2626; }

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
        .jd-empty-sub   { font-size:0.85rem; color:#94a3b8; margin:0; }

        .jd-browse-btn {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:10px; padding:0.65rem 1.5rem;
          cursor:pointer; display:inline-flex; align-items:center; gap:6px;
          box-shadow:0 4px 14px rgba(124,58,237,0.3); transition:all 0.2s; margin-top:8px;
        }
        .jd-browse-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(124,58,237,0.4); }

        .jd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.25rem; }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="jd-myapps">

        {/* Hero */}
        <div className="jd-myapps-hero">
          <div className="jd-myapps-hero-icon">
            <FileText size={24} color="white" />
          </div>
          <div className="jd-myapps-hero-text">
            <h2 className="jd-myapps-hero-title">My Applications</h2>
            <p className="jd-myapps-hero-sub">Track status, timeline & interview details</p>
          </div>
          {!loading && (
            <span className="jd-myapps-hero-badge">
              {applications.length} application{applications.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="jd-grid">
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ background:"white", borderRadius:18, border:"1.5px solid #ede9fe", overflow:"hidden" }}>
                <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="jd-skeleton" style={{ height:20, width:"65%" }} />
                  <div className="jd-skeleton" style={{ height:13, width:"40%" }} />
                  <div className="jd-skeleton" style={{ height:24, width:"30%", borderRadius:99 }} />
                </div>
                <div style={{ padding:"1rem 1.25rem", background:"#faf9ff", borderTop:"1px solid #f3f0ff", display:"flex", flexDirection:"column", gap:8 }}>
                  <div className="jd-skeleton" style={{ height:12, width:"80%" }} />
                  <div className="jd-skeleton" style={{ height:12, width:"60%" }} />
                  <div className="jd-skeleton" style={{ height:12, width:"70%" }} />
                </div>
                <div style={{ padding:"1rem 1.25rem", display:"flex", gap:8 }}>
                  <div className="jd-skeleton" style={{ flex:1, height:36, borderRadius:9 }} />
                  <div className="jd-skeleton" style={{ flex:1, height:36, borderRadius:9 }} />
                </div>
              </div>
            ))}
          </div>

        ) : applications.length === 0 ? (
          <div className="jd-empty-box">
            <svg width="70" height="70" viewBox="0 0 80 80" fill="none" style={{ animation:"jdFloat 3s ease-in-out infinite" }}>
              <rect x="14" y="12" width="44" height="56" rx="7" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="24" y1="28" x2="48" y2="28" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="24" y1="38" x2="48" y2="38" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="47" x2="38" y2="47" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="58" cy="58" r="14" fill="#7c3aed" opacity="0.12"/>
              <path d="M52 58l4 4 7-7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="jd-empty-title">No applications yet</p>
            <p className="jd-empty-sub">Start applying to jobs and track everything here.</p>
            <button className="jd-browse-btn" onClick={() => navigate("/jobs")}>
              Browse Jobs
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

        ) : (
          <div className="jd-grid">
            {applications.map((app) => {
              const si = getStatus(app.status);
              return (
                <div key={app._id} className="jd-myapps-card">

                  {/* Card top */}
                  <div className="jd-myapps-card-top">
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.5rem" }}>
                      <div style={{ flex:1 }}>
                        <h3 className="jd-myapps-job-title">
                          <BriefcaseBusiness size={15} color="#a78bfa" />
                          {app.job?.title || "Untitled Job"}
                        </h3>
                        <p className="jd-myapps-company">
                          <Building2 size={12} color="#a78bfa" />
                          {app.job?.company || "N/A"}
                        </p>
                        <p className="jd-myapps-date">
                          <CalendarCheck size={12} color="#c4b5fd" />
                          Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                        </p>
                      </div>
                      <span className="jd-status-pill" style={{ background:si.bg, color:si.color, borderColor:si.border, flexShrink:0 }}>
                        {si.label}
                      </span>
                    </div>

                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="jd-resume-link">
                        <ExternalLink size={12}/> View Resume
                      </a>
                    )}
                  </div>

                  {/* Timeline */}
                  {(app.statusHistory || []).length > 0 && (
                    <div className="jd-timeline">
                      <p className="jd-timeline-title">Application Timeline</p>
                      {app.statusHistory.map((entry, idx) => {
                        const es = getStatus(entry.status);
                        return (
                          <div key={`${entry.status}-${idx}`} className="jd-timeline-item">
                            <div className="jd-timeline-dot" style={{ background: es.color }} />
                            <div>
                              <p className="jd-timeline-status">{es.label}</p>
                              <p className="jd-timeline-date">{new Date(entry.date).toLocaleString("en-IN")}</p>
                              {entry.note && <p className="jd-timeline-note">{entry.note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="jd-myapps-actions">
                    <button className="jd-btn-secondary" onClick={() => navigate(`/jobs/${app.job?._id}`)}>
                      <BriefcaseBusiness size={13}/> Job Details
                    </button>
                    <button
                      className="jd-btn-primary"
                      onClick={() => navigate(`/chat?jobId=${app.job?._id}&recruiterId=${app.job?.recruiter?._id || app.job?.recruiter || ""}`)}
                    >
                      💬 Message Recruiter
                    </button>
                    {isWithdrawAllowed(app.status) && (
                      <button className="jd-btn-danger" onClick={() => handleWithdraw(app._id)}>
                        <XCircle size={13}/> Withdraw
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Applications;