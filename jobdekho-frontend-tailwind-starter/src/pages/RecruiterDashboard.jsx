import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness, Users, UserCheck, Trophy,
  PlusCircle, BarChart2, Building2, Eye, FileText,
} from "lucide-react";
import API from "../services/api";

const STATUS_META = {
  applied:             { label: "Applied",             color: "#b45309", bg: "#fffbeb", bar: "#f59e0b" },
  shortlisted:         { label: "Shortlisted",         color: "#1d4ed8", bg: "#eff6ff", bar: "#3b82f6" },
  interview_scheduled: { label: "Interview Scheduled", color: "#7c3aed", bg: "#f5f3ff", bar: "#8b5cf6" },
  selected:            { label: "Selected",            color: "#15803d", bg: "#f0fdf4", bar: "#22c55e" },
  rejected:            { label: "Rejected",            color: "#dc2626", bg: "#fff1f2", bar: "#ef4444" },
  withdrawn:           { label: "Withdrawn",           color: "#64748b", bg: "#f8fafc", bar: "#94a3b8" },
};

const RecruiterDashboard = () => {
  const [jobs, setJobs]         = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/recruiter");
        setJobs(res.data.jobsPosted || []);
        setAnalytics(res.data.analytics || null);
      } catch (err) {
        const message = err.response?.data?.error || "Failed to load recruiter dashboard.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const maxStatusCount = useMemo(() => {
    const values = Object.values(analytics?.statusBreakdown || {});
    return values.length ? Math.max(...values, 1) : 1;
  }, [analytics]);

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", gap:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #ede9fe", borderTopColor:"#7c3aed", animation:"jdSpin 0.7s linear infinite" }} />
        <p style={{ fontSize:"0.9rem", color:"#7c3aed", fontWeight:600 }}>Loading your dashboard...</p>
      </div>
    </>
  );

  /* ── Error ── */
  if (error) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", padding:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ background:"white", borderRadius:20, border:"1.5px solid #ede9fe", padding:"3rem 2.5rem", textAlign:"center", maxWidth:420, boxShadow:"0 8px 32px rgba(124,58,237,0.1)" }}>
          <div style={{ animation:"jdFloat 3s ease-in-out infinite", marginBottom:"1.25rem" }}><FileText size={52} color="#ef4444" style={{ margin:"0 auto" }} /></div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#1e1b4b", margin:"0 0 0.5rem" }}>Dashboard Error</h2>
          <p style={{ fontSize:"0.875rem", color:"#64748b", margin:0 }}>{error}</p>
        </div>
      </div>
    </>
  );

  const statCards = [
    { label: "Jobs Posted",     value: analytics?.totalJobsPosted   || 0, icon: <BriefcaseBusiness size={20} color="#7c3aed" />, iconBg:"#f5f3ff", iconBorder:"#ddd6fe" },
    { label: "Total Applications", value: analytics?.totalApplications || 0, icon: <Users            size={20} color="#1d4ed8" />, iconBg:"#eff6ff", iconBorder:"#bfdbfe" },
    { label: "Shortlisted",     value: analytics?.shortlistedCount   || 0, icon: <UserCheck          size={20} color="#7c3aed" />, iconBg:"#f5f3ff", iconBorder:"#ddd6fe" },
    { label: "Hired",           value: analytics?.hiredCount         || 0, icon: <Trophy             size={20} color="#15803d" />, iconBg:"#f0fdf4", iconBorder:"#bbf7d0" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-rd { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); padding:2.5rem 1rem; }

        /* Page header */
        .jd-rd-ph { max-width:1200px; margin:0 auto 1.75rem; background:white; border-radius:20px; border:1.5px solid #ede9fe; box-shadow:0 8px 32px rgba(124,58,237,0.10); overflow:hidden; }
        .jd-rd-ph-inner { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.5rem 2rem; display:flex; align-items:center; gap:1rem; position:relative; overflow:hidden; }
        .jd-rd-ph-inner::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-rd-ph-icon  { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-rd-ph-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; }
        .jd-rd-ph-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; }
        .jd-rd-post-btn {
          margin-left:auto; z-index:1;
          font-family:'Syne',sans-serif; font-size:0.85rem; font-weight:700;
          color:#7c3aed; background:white; border:none; border-radius:10px;
          padding:0.55rem 1.1rem; cursor:pointer; transition:all 0.2s;
          display:inline-flex; align-items:center; gap:6px; text-decoration:none;
          box-shadow:0 2px 8px rgba(0,0,0,0.12); white-space:nowrap;
        }
        .jd-rd-post-btn:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,0.18); }

        /* Stat cards */
        .jd-rd-stats { max-width:1200px; margin:0 auto 1.75rem; display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:1rem; }
        .jd-rd-stat  { background:white; border:1.5px solid #ede9fe; border-radius:16px; padding:1.25rem 1.25rem; box-shadow:0 4px 16px rgba(124,58,237,0.07); display:flex; align-items:center; gap:1rem; transition:all 0.2s; }
        .jd-rd-stat:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,0.13); border-color:#c4b5fd; }
        .jd-rd-stat-icon { width:44px; height:44px; border-radius:12px; border:1.5px solid; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .jd-rd-stat-label { font-size:0.75rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:3px; }
        .jd-rd-stat-value { font-family:'Syne',sans-serif; font-size:1.75rem; font-weight:900; color:#1e1b4b; line-height:1; }

        /* Main grid */
        .jd-rd-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
        @media(max-width:768px) { .jd-rd-grid { grid-template-columns:1fr; } }

        /* Panel */
        .jd-rd-panel { background:white; border:1.5px solid #ede9fe; border-radius:18px; box-shadow:0 4px 20px rgba(124,58,237,0.08); overflow:hidden; }
        .jd-rd-panel-head { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1rem 1.25rem; display:flex; align-items:center; gap:0.75rem; }
        .jd-rd-panel-head-icon { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; }
        .jd-rd-panel-head-title { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:800; color:white; margin:0; }
        .jd-rd-panel-body { padding:1.25rem; }

        /* Pipeline bars */
        .jd-rd-bar-row { margin-bottom:0.875rem; }
        .jd-rd-bar-row:last-child { margin-bottom:0; }
        .jd-rd-bar-meta { display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; }
        .jd-rd-bar-label { font-size:0.8rem; font-weight:600; color:#475569; display:flex; align-items:center; gap:6px; }
        .jd-rd-bar-dot   { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .jd-rd-bar-count { font-family:'Syne',sans-serif; font-size:0.85rem; font-weight:800; }
        .jd-rd-bar-track { height:8px; background:#f3f0ff; border-radius:999px; overflow:hidden; }
        .jd-rd-bar-fill  { height:100%; border-radius:999px; transition:width 0.6s cubic-bezier(0.4,0,0.2,1); }

        /* Job cards */
        .jd-rd-jobs-scroll { max-height:370px; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem; padding-right:2px; }
        .jd-rd-jobs-scroll::-webkit-scrollbar { width:4px; }
        .jd-rd-jobs-scroll::-webkit-scrollbar-track { background:#f3f0ff; border-radius:4px; }
        .jd-rd-jobs-scroll::-webkit-scrollbar-thumb { background:#c4b5fd; border-radius:4px; }

        .jd-rd-job-card { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:12px; padding:0.875rem 1rem; transition:all 0.2s; }
        .jd-rd-job-card:hover { border-color:#c4b5fd; background:#f5f3ff; }
        .jd-rd-job-title   { font-family:'Syne',sans-serif; font-size:0.9rem; font-weight:800; color:#1e1b4b; margin:0 0 3px; }
        .jd-rd-job-company { font-size:0.78rem; color:#7c3aed; font-weight:600; display:flex; align-items:center; gap:4px; margin-bottom:0.625rem; }
        .jd-rd-job-btns    { display:flex; gap:0.5rem; }

        .jd-btn-sm-primary { font-family:'Syne',sans-serif; font-size:0.75rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:8px; padding:0.4rem 0.75rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:5px; transition:all 0.2s; box-shadow:0 2px 8px rgba(124,58,237,0.25); }
        .jd-btn-sm-primary:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(124,58,237,0.38); }
        .jd-btn-sm-ghost   { font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:600; color:#7c3aed; background:white; border:1.5px solid #ddd6fe; border-radius:8px; padding:0.4rem 0.75rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:5px; transition:all 0.2s; }
        .jd-btn-sm-ghost:hover { background:#f5f3ff; border-color:#a78bfa; }

        /* Section label */
        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.875rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        /* Empty */
        .jd-rd-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; gap:0.5rem; }
        .jd-rd-empty-text { font-size:0.875rem; color:#94a3b8; font-weight:500; }

        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes jdSpin  { to{transform:rotate(360deg)} }
      `}</style>

      <div className="jd-rd">

        {/* Page Header */}
        <div className="jd-rd-ph">
          <div className="jd-rd-ph-inner">
            <div className="jd-rd-ph-icon"><BarChart2 size={20} color="white" /></div>
            <div>
              <p className="jd-rd-ph-title">Recruiter Dashboard</p>
              <p className="jd-rd-ph-sub">Monitor your jobs, pipeline and hiring analytics</p>
            </div>
            <Link to="/recruiter/post-job" className="jd-rd-post-btn">
              <PlusCircle size={15} /> Post Job
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="jd-rd-stats">
          {statCards.map(s => (
            <div key={s.label} className="jd-rd-stat">
              <div className="jd-rd-stat-icon" style={{ background: s.iconBg, borderColor: s.iconBorder }}>
                {s.icon}
              </div>
              <div>
                <p className="jd-rd-stat-label">{s.label}</p>
                <p className="jd-rd-stat-value">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="jd-rd-grid">

          {/* Pipeline Panel */}
          <div className="jd-rd-panel">
            <div className="jd-rd-panel-head">
              <div className="jd-rd-panel-head-icon"><BarChart2 size={16} color="white" /></div>
              <p className="jd-rd-panel-head-title">Application Pipeline</p>
            </div>
            <div className="jd-rd-panel-body">
              <p className="jd-section-label">📊 Status Breakdown</p>
              {Object.entries(STATUS_META).map(([key, meta]) => {
                const count = analytics?.statusBreakdown?.[key] || 0;
                const pct   = `${(count / maxStatusCount) * 100}%`;
                return (
                  <div key={key} className="jd-rd-bar-row">
                    <div className="jd-rd-bar-meta">
                      <span className="jd-rd-bar-label">
                        <span className="jd-rd-bar-dot" style={{ background: meta.bar }} />
                        {meta.label}
                      </span>
                      <span className="jd-rd-bar-count" style={{ color: meta.color }}>{count}</span>
                    </div>
                    <div className="jd-rd-bar-track">
                      <div className="jd-rd-bar-fill" style={{ width: pct, background: meta.bar }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Jobs Panel */}
          <div className="jd-rd-panel">
            <div className="jd-rd-panel-head">
              <div className="jd-rd-panel-head-icon"><BriefcaseBusiness size={16} color="white" /></div>
              <p className="jd-rd-panel-head-title">Posted Jobs</p>
              <span style={{ marginLeft:"auto", background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:"999px", padding:"0.2rem 0.65rem", fontSize:"0.75rem", fontFamily:"'Syne',sans-serif", fontWeight:700, color:"white" }}>
                {jobs.length}
              </span>
            </div>
            <div className="jd-rd-panel-body">
              <p className="jd-section-label">💼 Your Listings</p>
              {jobs.length === 0 ? (
                <div className="jd-rd-empty">
                  <BriefcaseBusiness size={36} color="#ddd6fe" />
                  <p className="jd-rd-empty-text">No jobs posted yet.</p>
                  <Link to="/recruiter/post-job" className="jd-btn-sm-primary" style={{ marginTop:"0.25rem" }}>
                    <PlusCircle size={13} /> Post your first job
                  </Link>
                </div>
              ) : (
                <div className="jd-rd-jobs-scroll">
                  {jobs.map(job => (
                    <div key={job._id} className="jd-rd-job-card">
                      <p className="jd-rd-job-title">{job.title}</p>
                      <p className="jd-rd-job-company"><Building2 size={12} />{job.company}</p>
                      <div className="jd-rd-job-btns">
                        <Link to={`/recruiter/jobs/${job._id}/applicants`} className="jd-btn-sm-primary">
                          <Users size={12} /> View Applicants
                        </Link>
                        <Link to={`/jobs/${job._id}`} className="jd-btn-sm-ghost">
                          <Eye size={12} /> View Job
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;