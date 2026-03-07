import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness, UserRound, Mail, CalendarDays,
  Video, MapPin, Edit, PlusCircle, FileText,
  Circle, Eye, Download, MessageSquare, CheckCircle,
  XCircle, Clock, AlertCircle, ChevronDown, X,
} from "lucide-react";

const STATUS_META = {
  applied:              { label: "Applied",              bg:"#fffbeb", color:"#b45309", border:"#fde68a" },
  shortlisted:          { label: "Shortlisted",          bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe" },
  interview_scheduled:  { label: "Interview Scheduled",  bg:"#f5f3ff", color:"#7c3aed", border:"#ddd6fe" },
  selected:             { label: "Selected",             bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0" },
  rejected:             { label: "Rejected",             bg:"#fff1f2", color:"#dc2626", border:"#fecaca" },
  withdrawn:            { label: "Withdrawn",            bg:"#f8fafc", color:"#64748b", border:"#e2e8f0" },
};

const statusLabel = (s) => STATUS_META[s]?.label || s || "Unknown";
const statusMeta  = (s) => STATUS_META[s] || { bg:"#f8fafc", color:"#64748b", border:"#e2e8f0" };

const timelineIcon = (s) => {
  if (s === "selected")  return <CheckCircle size={12} color="#15803d" />;
  if (s === "rejected")  return <XCircle     size={12} color="#dc2626" />;
  if (s === "applied")   return <Clock       size={12} color="#b45309" />;
  return <Circle size={12} color="#7c3aed" />;
};

const JobApplicantsList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle]           = useState("Job Applicants");
  const [applicants, setApplicants]       = useState([]);
  const [statusSelection, setStatusSelection] = useState({});
  const [updatingId, setUpdatingId]       = useState("");
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [previewResumeUrl, setPreviewResumeUrl] = useState("");
  const token = localStorage.getItem("token");

  const fetchApplicants = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const applications = res.data.applications || [];
      setApplicants(applications);
      setStatusSelection(applications.reduce((acc, app) => { acc[app._id] = app.status; return acc; }, {}));
      if (applications.length > 0 && applications[0].job?.title) {
        setJobTitle(applications[0].job.title);
      } else {
        const jobRes = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobTitle(jobRes.data.title);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load applicants.");
      toast.error(err.response?.data?.error || "Failed to load applicants.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchApplicants(); }, [jobId, token]);

  useEffect(() => {
    if (!token) return;
    const socket = io("http://localhost:5000", { auth: { token } });
    socket.on("application:status-updated", (payload) => {
      if (String(payload?.jobId) !== String(jobId)) return;
      fetchApplicants();
    });
    return () => socket.disconnect();
  }, [token, jobId]);

  const updateStatus = async (applicationId) => {
    const status = statusSelection[applicationId];
    if (!status) return;
    try {
      setUpdatingId(applicationId);
      await axios.patch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status, note: "Updated from recruiter dashboard" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application status updated.");
      fetchApplicants();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status.");
    } finally { setUpdatingId(""); }
  };

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", gap:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #ede9fe", borderTopColor:"#7c3aed", animation:"jdSpin 0.7s linear infinite" }} />
        <p style={{ fontSize:"0.9rem", color:"#7c3aed", fontWeight:600 }}>Loading applicants...</p>
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
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#1e1b4b", margin:"0 0 0.5rem" }}>Error Loading Applicants</h2>
          <p style={{ fontSize:"0.875rem", color:"#64748b", margin:"0 0 1.5rem" }}>{error}</p>
          <button onClick={() => navigate("/recruiter")} style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"white", border:"none", borderRadius:10, padding:"0.65rem 1.5rem", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.3)", fontFamily:"'Syne',sans-serif" }}>Back to Dashboard</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-jal { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); padding:2.5rem 1rem; }

        /* Page header */
        .jd-jal-ph { max-width:1200px; margin:0 auto 2rem; background:white; border-radius:20px; border:1.5px solid #ede9fe; box-shadow:0 8px 32px rgba(124,58,237,0.10); overflow:hidden; }
        .jd-jal-ph-inner { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.5rem 2rem; display:flex; align-items:center; gap:1rem; position:relative; overflow:hidden; }
        .jd-jal-ph-inner::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-jal-ph-icon  { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-jal-ph-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; }
        .jd-jal-ph-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; }
        .jd-jal-ph-count { margin-left:auto; z-index:1; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); border-radius:999px; padding:0.3rem 0.9rem; font-family:'Syne',sans-serif; font-size:0.8rem; font-weight:700; color:white; white-space:nowrap; }

        /* Grid */
        .jd-jal-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:1.25rem; list-style:none; padding:0; }

        /* Card */
        .jd-jal-card { background:white; border-radius:18px; border:1.5px solid #ede9fe; box-shadow:0 4px 20px rgba(124,58,237,0.08); overflow:hidden; display:flex; flex-direction:column; transition:all 0.22s; }
        .jd-jal-card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(124,58,237,0.15); border-color:#c4b5fd; }

        /* Card header strip */
        .jd-jal-card-head { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1rem 1.25rem; display:flex; align-items:center; gap:0.75rem; position:relative; overflow:hidden; }
        .jd-jal-card-head::before { content:''; position:absolute; top:-30px; right:-30px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-jal-card-head-avatar { width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.22); border:2px solid rgba(255,255,255,0.35); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-jal-card-head-name  { font-family:'Syne',sans-serif; font-size:1rem; font-weight:800; color:white; margin:0; z-index:1; }
        .jd-jal-card-head-email { font-size:0.75rem; color:#c4b5fd; margin:0; z-index:1; display:flex; align-items:center; gap:4px; }

        /* Card body */
        .jd-jal-body { padding:1.1rem 1.25rem; display:flex; flex-direction:column; gap:0.75rem; flex:1; }

        /* Status pill */
        .jd-jal-status { display:inline-flex; align-items:center; gap:5px; padding:0.3rem 0.8rem; border-radius:999px; font-size:0.75rem; font-weight:700; border:1.5px solid; width:fit-content; }

        /* Skills */
        .jd-jal-skills { display:flex; flex-wrap:wrap; gap:0.4rem; }
        .jd-jal-skill  { background:#f5f3ff; border:1.5px solid #ede9fe; color:#7c3aed; font-size:0.72rem; font-weight:600; padding:0.2rem 0.6rem; border-radius:999px; }

        /* Timeline */
        .jd-jal-timeline { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:12px; padding:0.875rem 1rem; }
        .jd-jal-tl-title { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; margin-bottom:0.625rem; display:flex; align-items:center; gap:6px; }
        .jd-jal-tl-title::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }
        .jd-jal-tl-item { display:flex; align-items:flex-start; gap:0.625rem; font-size:0.8rem; padding:0.35rem 0; border-bottom:1px solid #f3f0ff; }
        .jd-jal-tl-item:last-child { border-bottom:none; padding-bottom:0; }
        .jd-jal-tl-dot  { margin-top:2px; flex-shrink:0; }
        .jd-jal-tl-label { font-weight:600; color:#1e1b4b; }
        .jd-jal-tl-date  { font-size:0.72rem; color:#94a3b8; }
        .jd-jal-tl-note  { font-size:0.72rem; color:#64748b; font-style:italic; }

        /* Section label */
        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.5rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        /* Buttons */
        .jd-btn-primary   { font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:10px; padding:0.6rem 0.875rem; cursor:pointer; transition:all 0.2s; box-shadow:0 3px 10px rgba(124,58,237,0.28); display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-primary:hover { transform:translateY(-1px); box-shadow:0 5px 16px rgba(124,58,237,0.4); }
        .jd-btn-secondary { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#7c3aed; background:white; border:1.5px solid #c4b5fd; border-radius:10px; padding:0.6rem 0.875rem; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-secondary:hover { background:#f5f3ff; border-color:#7c3aed; }
        .jd-btn-success   { font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; color:white; background:linear-gradient(135deg,#16a34a,#15803d); border:none; border-radius:10px; padding:0.6rem 0.875rem; cursor:pointer; transition:all 0.2s; box-shadow:0 3px 10px rgba(22,163,74,0.25); display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-success:hover { transform:translateY(-1px); box-shadow:0 5px 14px rgba(22,163,74,0.38); }
        .jd-btn-warn      { font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; color:white; background:linear-gradient(135deg,#d97706,#b45309); border:none; border-radius:10px; padding:0.6rem 0.875rem; cursor:pointer; transition:all 0.2s; box-shadow:0 3px 10px rgba(180,83,9,0.25); display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-warn:hover { transform:translateY(-1px); }
        .jd-btn-msg       { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#4f46e5; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:0.6rem 0.875rem; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; width:100%; }
        .jd-btn-msg:hover { background:#dbeafe; border-color:#93c5fd; }

        /* Status update row */
        .jd-jal-update-row { display:flex; gap:0.5rem; }
        .jd-jal-select-wrap { position:relative; flex:1; }
        .jd-jal-select-wrap::after { content:''; position:absolute; right:10px; top:50%; transform:translateY(-50%); border-left:4px solid transparent; border-right:4px solid transparent; border-top:5px solid #7c3aed; pointer-events:none; }
        .jd-jal-select { font-family:'DM Sans',sans-serif; font-size:0.82rem; color:#1e1b4b; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px; padding:0.6rem 2rem 0.6rem 0.75rem; outline:none; transition:all 0.2s; width:100%; appearance:none; -webkit-appearance:none; cursor:pointer; }
        .jd-jal-select:focus { border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        /* Interview mini card */
        .jd-jal-iv-card { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:12px; padding:0.875rem 1rem; }
        .jd-jal-iv-row  { display:flex; align-items:center; gap:0.5rem; font-size:0.82rem; color:#475569; margin-bottom:0.4rem; }
        .jd-jal-iv-row:last-child { margin-bottom:0; }

        /* Card footer */
        .jd-jal-footer { padding:0 1.25rem 1.25rem; display:flex; flex-direction:column; gap:0.5rem; }
        .jd-jal-divider { height:1px; background:#f3f0ff; margin:0.25rem 0; }

        /* Empty state */
        .jd-jal-empty { max-width:420px; margin:2rem auto; background:white; border-radius:20px; border:1.5px solid #ede9fe; box-shadow:0 8px 32px rgba(124,58,237,0.10); padding:3rem 2rem; text-align:center; }
        .jd-jal-empty-icon  { animation:jdFloat 3s ease-in-out infinite; margin-bottom:1.25rem; }
        .jd-jal-empty-title { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800; color:#1e1b4b; margin:0 0 0.5rem; }
        .jd-jal-empty-sub   { font-size:0.875rem; color:#64748b; margin:0 0 1.5rem; }

        /* Modal */
        .jd-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:50; display:flex; align-items:center; justify-content:center; padding:1rem; backdrop-filter:blur(2px); }
        .jd-modal { background:white; border-radius:20px; width:100%; max-width:900px; height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.25); border:1.5px solid #ede9fe; }
        .jd-modal-head { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1rem 1.5rem; display:flex; align-items:center; justify-content:space-between; }
        .jd-modal-head-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:800; color:white; margin:0; }
        .jd-modal-close { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
        .jd-modal-close:hover { background:rgba(255,255,255,0.3); }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="jd-jal">

        {/* Page Header */}
        <div className="jd-jal-ph">
          <div className="jd-jal-ph-inner">
            <div className="jd-jal-ph-icon"><BriefcaseBusiness size={20} color="white" /></div>
            <div>
              <p className="jd-jal-ph-title">Applicants for "{jobTitle}"</p>
              <p className="jd-jal-ph-sub">Review, manage and schedule interviews</p>
            </div>
            <span className="jd-jal-ph-count">{applicants.length} Applicant{applicants.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Empty */}
        {applicants.length === 0 ? (
          <div className="jd-jal-empty">
            <div className="jd-jal-empty-icon"><UserRound size={52} color="#c4b5fd" /></div>
            <p className="jd-jal-empty-title">No Applicants Yet</p>
            <p className="jd-jal-empty-sub">Applications will appear here once candidates apply for this role.</p>
            <Link to="/recruiter" className="jd-btn-primary" style={{ width:"fit-content", margin:"0 auto" }}>Back to Dashboard</Link>
          </div>
        ) : (
          <ul className="jd-jal-grid">
            {applicants.map((application) => {
              const sm = statusMeta(application.status);
              return (
                <li key={application._id} className="jd-jal-card">

                  {/* Card Header */}
                  <div className="jd-jal-card-head">
                    <div className="jd-jal-card-head-avatar"><UserRound size={18} color="white" /></div>
                    <div style={{ zIndex:1, overflow:"hidden" }}>
                      <p className="jd-jal-card-head-name">{application.user?.name || "N/A"}</p>
                      <p className="jd-jal-card-head-email"><Mail size={11} />{application.user?.email || "N/A"}</p>
                    </div>
                    <div style={{ marginLeft:"auto", zIndex:1 }}>
                      <span className="jd-jal-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>
                        {statusLabel(application.status)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="jd-jal-body">

                    {/* Skills */}
                    {application.skills?.length > 0 && (
                      <div>
                        <p className="jd-section-label">🛠 Skills</p>
                        <div className="jd-jal-skills">
                          {application.skills.map(skill => (
                            <span key={skill} className="jd-jal-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    {(application.statusHistory || []).length > 0 && (
                      <div className="jd-jal-timeline">
                        <p className="jd-jal-tl-title">📋 Timeline</p>
                        {application.statusHistory.map((entry, idx) => (
                          <div key={`${entry.status}-${idx}`} className="jd-jal-tl-item">
                            <span className="jd-jal-tl-dot">{timelineIcon(entry.status)}</span>
                            <div>
                              <p className="jd-jal-tl-label">{statusLabel(entry.status)}</p>
                              <p className="jd-jal-tl-date">{new Date(entry.date).toLocaleString()}</p>
                              {entry.note && <p className="jd-jal-tl-note">{entry.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resume buttons */}
                    {application.resumeUrl && (
                      <div>
                        <p className="jd-section-label">📄 Resume</p>
                        <div style={{ display:"flex", gap:"0.5rem" }}>
                          <button onClick={() => setPreviewResumeUrl(application.resumeUrl)} className="jd-btn-primary" style={{ flex:1 }}>
                            <Eye size={14} /> Preview
                          </button>
                          <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="jd-btn-secondary" style={{ flex:1 }}>
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <button onClick={() => navigate(`/chat?jobId=${jobId}&candidateId=${application.user?._id || ""}`)} className="jd-btn-msg">
                      <MessageSquare size={14} /> Message Candidate
                    </button>

                    {/* Status update */}
                    <div>
                      <p className="jd-section-label">🏷 Update Status</p>
                      <div className="jd-jal-update-row">
                        <div className="jd-jal-select-wrap">
                          <select
                            value={statusSelection[application._id] || application.status}
                            onChange={(e) => setStatusSelection(prev => ({ ...prev, [application._id]: e.target.value }))}
                            className="jd-jal-select"
                          >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview_scheduled">Interview Scheduled</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <button
                          onClick={() => updateStatus(application._id)}
                          disabled={updatingId === application._id}
                          className="jd-btn-primary"
                          style={{ opacity: updatingId === application._id ? 0.6 : 1, cursor: updatingId === application._id ? "not-allowed" : "pointer" }}
                        >
                          {updatingId === application._id ? "Saving..." : "Update"}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Card Footer — Interview */}
                  <div className="jd-jal-footer">
                    <div className="jd-jal-divider" />
                    {application.interview ? (
                      <div className="jd-jal-iv-card">
                        <p className="jd-section-label"><CalendarDays size={12} /> Interview Details</p>
                        <div className="jd-jal-iv-row">
                          <CalendarDays size={13} color="#7c3aed" />
                          <span>{new Date(application.interview.date).toLocaleString()}</span>
                        </div>
                        <div className="jd-jal-iv-row">
                          {application.interview.mode === "online"
                            ? <Video size={13} color="#7c3aed" />
                            : <MapPin size={13} color="#16a34a" />
                          }
                          <span style={{ textTransform:"capitalize" }}>{application.interview.mode}</span>
                        </div>
                        <Link to={`/recruiter/interviews/${application.interview._id}/edit`} className="jd-btn-warn" style={{ width:"100%", marginTop:"0.625rem" }}>
                          <Edit size={14} /> Edit Interview
                        </Link>
                      </div>
                    ) : (
                      <Link to={`/recruiter/interviews/schedule/${application._id}`} className="jd-btn-success">
                        <PlusCircle size={14} /> Schedule Interview
                      </Link>
                    )}
                  </div>

                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Resume Preview Modal */}
      {previewResumeUrl && (
        <div className="jd-modal-overlay" onClick={() => setPreviewResumeUrl("")}>
          <div className="jd-modal" onClick={e => e.stopPropagation()}>
            <div className="jd-modal-head">
              <p className="jd-modal-head-title">📄 Resume Preview</p>
              <button className="jd-modal-close" onClick={() => setPreviewResumeUrl("")}>
                <X size={16} color="white" />
              </button>
            </div>
            <div style={{ flex:1 }}>
              <iframe title="Resume Preview" src={previewResumeUrl} style={{ width:"100%", height:"100%", border:"none" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobApplicantsList;