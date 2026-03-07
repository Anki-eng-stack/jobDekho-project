import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness, Building2, MapPin, IndianRupee,
  Tag, Sparkles, AlignLeft, Send, AlertCircle,
  MessageSquare, CheckCircle, Ban, ImageOff,
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob]                   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
        if (token) {
          try {
            const appRes = await axios.get("http://localhost:5000/api/applications/my", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const applied = (appRes.data.applications || []).some(
              (app) => (app.jobId || app.job?._id) === id
            );
            setAlreadyApplied(applied);
          } catch (appErr) {
            console.warn("Could not verify apply status:", appErr);
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        toast.error("Job not found or an error occurred.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, token]);

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", gap:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #ede9fe", borderTopColor:"#7c3aed", animation:"jdSpin 0.7s linear infinite" }} />
        <p style={{ fontSize:"0.9rem", color:"#7c3aed", fontWeight:600 }}>Loading job details...</p>
      </div>
    </>
  );

  /* ── Not Found ── */
  if (!job) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", padding:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ background:"white", borderRadius:20, border:"1.5px solid #ede9fe", padding:"3rem 2.5rem", textAlign:"center", maxWidth:420, boxShadow:"0 8px 32px rgba(124,58,237,0.1)" }}>
          <div style={{ animation:"jdFloat 3s ease-in-out infinite", marginBottom:"1.25rem" }}><AlertCircle size={52} color="#ef4444" style={{ margin:"0 auto" }} /></div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#1e1b4b", margin:"0 0 0.5rem" }}>Job Not Found</h2>
          <p style={{ fontSize:"0.875rem", color:"#64748b", margin:"0 0 1.5rem" }}>This job may no longer exist or has been removed.</p>
          <button onClick={() => navigate("/jobs")} style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"white", border:"none", borderRadius:10, padding:"0.65rem 1.5rem", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", fontFamily:"'Syne',sans-serif", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}>Browse All Jobs</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-jd { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); padding:2.5rem 1rem; }

        .jd-jd-card { max-width:820px; margin:0 auto; background:white; border-radius:22px; border:1.5px solid #ede9fe; box-shadow:0 12px 48px rgba(124,58,237,0.12); overflow:hidden; }

        /* Image */
        .jd-jd-img { width:100%; height:260px; object-fit:cover; display:block; }
        .jd-jd-img-placeholder { width:100%; height:200px; background:linear-gradient(135deg,#f5f3ff,#ede9fe); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; color:#c4b5fd; font-size:0.875rem; font-weight:500; }

        /* Header */
        .jd-jd-header { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.75rem 2rem; position:relative; overflow:hidden; }
        .jd-jd-header::before { content:''; position:absolute; top:-60px; right:-60px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-jd-header::after  { content:''; position:absolute; bottom:-50px; left:-40px; width:160px; height:160px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-jd-header-chip { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.28); color:#ede9fe; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; padding:0.25rem 0.75rem; border-radius:999px; margin-bottom:0.875rem; position:relative; z-index:1; }
        .jd-jd-header-title { font-family:'Syne',sans-serif; font-size:clamp(1.4rem,3vw,2rem); font-weight:900; color:white; margin:0 0 0.25rem; z-index:1; position:relative; line-height:1.2; }
        .jd-jd-header-company { font-size:0.9rem; color:#c4b5fd; display:flex; align-items:center; gap:6px; z-index:1; position:relative; }

        /* Body */
        .jd-jd-body { padding:2rem; display:flex; flex-direction:column; gap:1.75rem; }

        /* Info grid */
        .jd-jd-info-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0.75rem; }
        .jd-jd-info-item { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:12px; padding:0.875rem 1rem; display:flex; align-items:center; gap:0.75rem; }
        .jd-jd-info-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .jd-jd-info-label { font-size:0.72rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1px; }
        .jd-jd-info-value { font-size:0.875rem; font-weight:600; color:#1e1b4b; }

        /* Section label */
        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.875rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        /* Skills */
        .jd-jd-skills { display:flex; flex-wrap:wrap; gap:0.5rem; }
        .jd-jd-skill  { background:#f5f3ff; border:1.5px solid #ddd6fe; color:#7c3aed; font-size:0.8rem; font-weight:600; padding:0.35rem 0.875rem; border-radius:999px; transition:all 0.2s; }
        .jd-jd-skill:hover { background:#ede9fe; transform:translateY(-1px); }

        /* Description */
        .jd-jd-desc { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px; padding:1.25rem 1.5rem; font-size:0.9rem; color:#334155; line-height:1.75; }

        /* CTA Buttons */
        .jd-jd-ctas { display:flex; gap:0.875rem; flex-wrap:wrap; }

        .jd-btn-apply {
          font-family:'Syne',sans-serif; flex:1; min-width:140px;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:linear-gradient(135deg,#7c3aed,#4f46e5); color:white;
          font-size:0.95rem; font-weight:700; padding:0.875rem 1.5rem;
          border:none; border-radius:12px; cursor:pointer; transition:all 0.2s;
          box-shadow:0 4px 16px rgba(124,58,237,0.32); text-decoration:none;
        }
        .jd-btn-apply:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(124,58,237,0.44); }

        .jd-btn-message {
          font-family:'Syne',sans-serif; flex:1; min-width:140px;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:white; color:#7c3aed;
          font-size:0.95rem; font-weight:700; padding:0.875rem 1.5rem;
          border:1.5px solid #c4b5fd; border-radius:12px; cursor:pointer; transition:all 0.2s;
          text-decoration:none;
        }
        .jd-btn-message:hover { background:#f5f3ff; border-color:#7c3aed; transform:translateY(-2px); }

        .jd-btn-disabled {
          font-family:'Syne',sans-serif; flex:1; min-width:140px;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:#f1f5f9; color:#94a3b8; font-size:0.95rem; font-weight:700;
          padding:0.875rem 1.5rem; border:1.5px solid #e2e8f0; border-radius:12px;
          cursor:not-allowed;
        }

        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="jd-jd">
        <div className="jd-jd-card">

          {/* Job Image */}
          {job.jobImage?.url ? (
            <img src={job.jobImage.url} alt={job.title || "Job"} className="jd-jd-img"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/820x260/ede9fe/7c3aed?text=JobDekho"; }} />
          ) : (
            <div className="jd-jd-img-placeholder">
              <ImageOff size={32} />
              <span>No image available</span>
            </div>
          )}

          {/* Header */}
          <div className="jd-jd-header">
            <div className="jd-jd-header-chip"><BriefcaseBusiness size={11} /> Job Opening</div>
            <h1 className="jd-jd-header-title">{job.title}</h1>
            {job.company && (
              <p className="jd-jd-header-company"><Building2 size={14} /> {job.company}</p>
            )}
          </div>

          {/* Body */}
          <div className="jd-jd-body">

            {/* Info Grid */}
            <div className="jd-jd-info-grid">
              <div className="jd-jd-info-item">
                <div className="jd-jd-info-icon" style={{ background:"#faf9ff", border:"1.5px solid #ede9fe" }}><MapPin size={16} color="#7c3aed" /></div>
                <div>
                  <p className="jd-jd-info-label">Location</p>
                  <p className="jd-jd-info-value">{job.location || "N/A"}</p>
                </div>
              </div>
              <div className="jd-jd-info-item">
                <div className="jd-jd-info-icon" style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0" }}><IndianRupee size={16} color="#15803d" /></div>
                <div>
                  <p className="jd-jd-info-label">Salary</p>
                  <p className="jd-jd-info-value">{job.salary ? `₹${job.salary.toLocaleString("en-IN")}` : "Not mentioned"}</p>
                </div>
              </div>
              <div className="jd-jd-info-item">
                <div className="jd-jd-info-icon" style={{ background:"#fdf4ff", border:"1.5px solid #e9d5ff" }}><Tag size={16} color="#9333ea" /></div>
                <div>
                  <p className="jd-jd-info-label">Job Type</p>
                  <p className="jd-jd-info-value">{job.jobType || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="jd-section-label"><Sparkles size={12} /> Required Skills</p>
              {Array.isArray(job.skills) && job.skills.length > 0 ? (
                <div className="jd-jd-skills">
                  {job.skills.map((s, i) => <span key={i} className="jd-jd-skill">{s}</span>)}
                </div>
              ) : (
                <p style={{ fontSize:"0.875rem", color:"#94a3b8" }}>No specific skills listed.</p>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="jd-section-label"><AlignLeft size={12} /> Job Description</p>
              <div className="jd-jd-desc">{job.description || "No description provided."}</div>
            </div>

            {/* CTA */}
            <div className="jd-jd-ctas">
              {userRole && userRole !== "jobseeker" ? (
                <div className="jd-btn-disabled"><Ban size={17} /> Recruiters cannot apply</div>
              ) : alreadyApplied ? (
                <>
                  <div className="jd-btn-disabled"><CheckCircle size={17} /> Already Applied</div>
                  <button onClick={() => navigate(`/chat?jobId=${job._id}&recruiterId=${job.recruiter?._id || job.recruiter}`)} className="jd-btn-message">
                    <MessageSquare size={17} /> Message Recruiter
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate(`/apply/${job._id}`)} className="jd-btn-apply">
                    <Send size={17} /> Apply Now
                  </button>
                  <button onClick={() => navigate(`/chat?jobId=${job._id}&recruiterId=${job.recruiter?._id || job.recruiter}`)} className="jd-btn-message">
                    <MessageSquare size={17} /> Message Recruiter
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;