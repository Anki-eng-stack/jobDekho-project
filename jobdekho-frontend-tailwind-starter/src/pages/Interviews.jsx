import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  CalendarDays, BriefcaseBusiness, CalendarCheck2,
  Video, MapPin, Hourglass, CheckCircle, XCircle,
  AlertCircle, UserRound, NotebookPen,
} from "lucide-react";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interviews/my");
        setInterviews(res.data.interviews);
        toast.success("Interviews loaded successfully!");
      } catch (err) {
        console.error("Failed to load interviews", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Failed to load interviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled": return { text: "Scheduled", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", icon: <CalendarCheck2 size={13} /> };
      case "completed": return { text: "Completed", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", icon: <CheckCircle    size={13} /> };
      case "cancelled": return { text: "Cancelled", bg: "#fff1f2", color: "#dc2626", border: "#fecaca", icon: <XCircle        size={13} /> };
      case "pending":   return { text: "Pending",   bg: "#fffbeb", color: "#b45309", border: "#fde68a", icon: <Hourglass      size={13} /> };
      default:          return { text: status || "Unknown", bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", icon: null };
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-iv { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); padding:2.5rem 1rem; }

        /* Page header */
        .jd-iv-page-header {
          max-width:1100px; margin:0 auto 2rem;
          background:white; border-radius:20px;
          border:1.5px solid #ede9fe;
          box-shadow:0 8px 32px rgba(124,58,237,0.10);
          overflow:hidden;
        }
        .jd-iv-ph-inner {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1.5rem 2rem; display:flex; align-items:center; gap:1rem;
          position:relative; overflow:hidden;
        }
        .jd-iv-ph-inner::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-iv-ph-icon { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-iv-ph-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; }
        .jd-iv-ph-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; }
        .jd-iv-ph-count { margin-left:auto; z-index:1; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); border-radius:999px; padding:0.3rem 0.9rem; font-family:'Syne',sans-serif; font-size:0.8rem; font-weight:700; color:white; }

        /* Grid */
        .jd-iv-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.25rem; }

        /* Card */
        .jd-iv-card {
          background:white; border-radius:18px; border:1.5px solid #ede9fe;
          box-shadow:0 4px 20px rgba(124,58,237,0.08);
          overflow:hidden; display:flex; flex-direction:column;
          transition:all 0.22s;
        }
        .jd-iv-card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(124,58,237,0.15); border-color:#c4b5fd; }

        .jd-iv-card-header {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1rem 1.25rem; display:flex; align-items:flex-start; gap:0.75rem;
          position:relative; overflow:hidden;
        }
        .jd-iv-card-header::before { content:''; position:absolute; top:-30px; right:-30px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-iv-card-header-icon { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-iv-card-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:800; color:white; margin:0; z-index:1; line-height:1.3; }

        .jd-iv-card-body { padding:1.1rem 1.25rem; display:flex; flex-direction:column; gap:0.6rem; flex:1; }

        .jd-iv-row { display:flex; align-items:center; gap:0.6rem; font-size:0.84rem; }
        .jd-iv-row-icon { width:28px; height:28px; border-radius:8px; background:#faf9ff; border:1.5px solid #ede9fe; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .jd-iv-row-label { font-weight:600; color:#475569; min-width:60px; font-size:0.78rem; }
        .jd-iv-row-value { color:#1e1b4b; font-weight:500; }

        .jd-iv-divider { height:1px; background:#f3f0ff; margin:0.25rem 0; }

        .jd-iv-status-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:0.3rem 0.75rem; border-radius:999px;
          font-size:0.75rem; font-weight:700; border:1.5px solid;
        }

        .jd-iv-notes {
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem; font-size:0.8rem; color:#475569;
          display:flex; align-items:flex-start; gap:0.5rem; line-height:1.55;
          margin-top:0.25rem;
        }

        .jd-iv-card-footer { padding:0 1.25rem 1.25rem; }

        .jd-iv-join-btn {
          font-family:'Syne',sans-serif; font-size:0.85rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:10px; padding:0.65rem 1rem;
          width:100%; cursor:pointer; transition:all 0.2s;
          box-shadow:0 3px 12px rgba(124,58,237,0.28);
          display:flex; align-items:center; justify-content:center; gap:7px;
          text-decoration:none;
        }
        .jd-iv-join-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(124,58,237,0.4); }

        .jd-iv-venue {
          background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:10px;
          padding:0.65rem 0.875rem; font-size:0.82rem; color:#15803d;
          display:flex; align-items:center; gap:7px; font-weight:600;
        }

        /* Loading */
        .jd-iv-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; gap:1rem; }
        .jd-iv-spinner { width:40px; height:40px; border-radius:50%; border:3px solid #ede9fe; border-top-color:#7c3aed; animation:jdSpin 0.7s linear infinite; }

        /* Empty */
        .jd-iv-empty {
          max-width:420px; margin:2rem auto; background:white;
          border-radius:20px; border:1.5px solid #ede9fe;
          box-shadow:0 8px 32px rgba(124,58,237,0.10);
          padding:3rem 2rem; text-align:center;
        }
        .jd-iv-empty-icon { animation:jdFloat 3s ease-in-out infinite; margin-bottom:1.25rem; }
        .jd-iv-empty-title { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800; color:#1e1b4b; margin:0 0 0.5rem; }
        .jd-iv-empty-sub   { font-size:0.875rem; color:#64748b; margin:0; line-height:1.6; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="jd-iv">

        {/* Page Header */}
        <div className="jd-iv-page-header">
          <div className="jd-iv-ph-inner">
            <div className="jd-iv-ph-icon"><CalendarDays size={20} color="white" /></div>
            <div>
              <p className="jd-iv-ph-title">My Interviews</p>
              <p className="jd-iv-ph-sub">Track all your scheduled & past interviews</p>
            </div>
            {!loading && (
              <span className="jd-iv-ph-count">{interviews.length} Interview{interviews.length !== 1 ? "s" : ""}</span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="jd-iv-loading">
            <div className="jd-iv-spinner" />
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", color:"#7c3aed", fontWeight:600 }}>Loading your interviews...</p>
          </div>

        ) : interviews.length === 0 ? (
          <div className="jd-iv-empty">
            <div className="jd-iv-empty-icon"><AlertCircle size={52} color="#c4b5fd" /></div>
            <p className="jd-iv-empty-title">No Interviews Yet</p>
            <p className="jd-iv-empty-sub">Keep applying for jobs and your interview invites will show up here.</p>
          </div>

        ) : (
          <ul className="jd-iv-grid" style={{ listStyle:"none", padding:0, margin:0 }}>
            {interviews.map((iv) => {
              const statusInfo = getStatusInfo(iv.status);
              const interviewDate = new Date(iv.date);
              const formattedDate = interviewDate.toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" });
              const formattedTime = interviewDate.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });

              return (
                <li key={iv._id} className="jd-iv-card">

                  {/* Card Header */}
                  <div className="jd-iv-card-header">
                    <div className="jd-iv-card-header-icon"><BriefcaseBusiness size={18} color="white" /></div>
                    <p className="jd-iv-card-title">{iv.jobTitle || "Untitled Job Interview"}</p>
                  </div>

                  {/* Card Body */}
                  <div className="jd-iv-card-body">

                    {iv.recruiter?.name && (
                      <>
                        <div className="jd-iv-row">
                          <div className="jd-iv-row-icon"><UserRound size={14} color="#7c3aed" /></div>
                          <span className="jd-iv-row-label">Recruiter</span>
                          <span className="jd-iv-row-value">{iv.recruiter.name}</span>
                        </div>
                        <div className="jd-iv-divider" />
                      </>
                    )}

                    <div className="jd-iv-row">
                      <div className="jd-iv-row-icon"><CalendarCheck2 size={14} color="#7c3aed" /></div>
                      <span className="jd-iv-row-label">Date</span>
                      <span className="jd-iv-row-value">{formattedDate} &middot; {formattedTime}</span>
                    </div>

                    <div className="jd-iv-divider" />

                    <div className="jd-iv-row">
                      <div className="jd-iv-row-icon">
                        {iv.mode?.toLowerCase() === "online"
                          ? <Video size={14} color="#7c3aed" />
                          : <MapPin size={14} color="#16a34a" />
                        }
                      </div>
                      <span className="jd-iv-row-label">Mode</span>
                      <span className="jd-iv-row-value" style={{ textTransform:"capitalize" }}>{iv.mode}</span>
                    </div>

                    <div className="jd-iv-divider" />

                    <div className="jd-iv-row">
                      <div className="jd-iv-row-icon" style={{ background: statusInfo.bg, borderColor: statusInfo.border }}>
                        <span style={{ color: statusInfo.color }}>{statusInfo.icon}</span>
                      </div>
                      <span className="jd-iv-row-label">Status</span>
                      <span className="jd-iv-status-pill" style={{ background: statusInfo.bg, color: statusInfo.color, borderColor: statusInfo.border }}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </div>

                    {iv.notes && (
                      <div className="jd-iv-notes">
                        <NotebookPen size={14} color="#a78bfa" style={{ flexShrink:0, marginTop:1 }} />
                        <span>{iv.notes}</span>
                      </div>
                    )}

                  </div>

                  {/* Card Footer */}
                  {iv.location && (
                    <div className="jd-iv-card-footer">
                      {iv.mode?.toLowerCase() === "online" ? (
                        <a href={iv.location} target="_blank" rel="noopener noreferrer" className="jd-iv-join-btn">
                          <Video size={15} /> Join Interview
                        </a>
                      ) : (
                        <div className="jd-iv-venue">
                          <MapPin size={15} /> {iv.location}
                        </div>
                      )}
                    </div>
                  )}

                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default Interviews;