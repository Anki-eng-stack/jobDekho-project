import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness, Building2, MapPin,
  IndianRupee, AlignLeft, Send, Tag,
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", description: "", location: "", company: "", salary: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/jobs", formData);
      toast.success("Job posted successfully!");
      navigate("/recruiter");
    } catch (err) {
      console.error("Error creating job:", err.response || err);
      toast.error(err.response?.data?.error || "Failed to post job. Please ensure all required fields are filled correctly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-pj { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2.5rem 1rem; position:relative; overflow:hidden; }
        .jd-pj-blob1 { position:absolute; top:-80px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(167,139,250,0.22),transparent 70%); pointer-events:none; }
        .jd-pj-blob2 { position:absolute; bottom:-100px; left:-80px; width:380px; height:380px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%); pointer-events:none; }

        .jd-pj-card { position:relative; z-index:1; background:white; border-radius:22px; border:1.5px solid #ede9fe; width:100%; max-width:600px; box-shadow:0 20px 60px rgba(124,58,237,0.13); overflow:hidden; }

        /* Header */
        .jd-pj-header { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.75rem 2rem; display:flex; align-items:center; gap:1rem; position:relative; overflow:hidden; }
        .jd-pj-header::before { content:''; position:absolute; top:-50px; right:-50px; width:190px; height:190px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-pj-header::after  { content:''; position:absolute; bottom:-40px; left:-30px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-pj-header-icon  { width:50px; height:50px; border-radius:14px; background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.28); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; animation:jdFloat 3.5s ease-in-out infinite; }
        .jd-pj-header-title { font-family:'Syne',sans-serif; font-size:1.35rem; font-weight:900; color:white; margin:0 0 3px; z-index:1; position:relative; }
        .jd-pj-header-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; position:relative; }

        /* Body */
        .jd-pj-body { padding:1.75rem 2rem 2rem; display:flex; flex-direction:column; gap:1.25rem; }

        /* Section label */
        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.75rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .jd-field-label span { color:#ef4444; }

        /* Input wrap */
        .jd-input-wrap { position:relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }
        .jd-textarea-icon { position:absolute; left:0.75rem; top:0.75rem; pointer-events:none; }

        .jd-input, .jd-textarea {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem 0.65rem 2.5rem;
          outline:none; transition:all 0.2s; width:100%; box-sizing:border-box;
        }
        .jd-input::placeholder, .jd-textarea::placeholder { color:#c4b5fd; }
        .jd-input:focus, .jd-textarea:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        .jd-textarea { padding-top:0.65rem; padding-left:2.5rem; resize:vertical; min-height:120px; line-height:1.65; }

        /* Two-col grid */
        .jd-pj-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.875rem; }
        @media(max-width:500px) { .jd-pj-grid { grid-template-columns:1fr; } }

        /* Submit */
        .jd-btn-submit { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:12px; padding:0.9rem 1.5rem; width:100%; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(124,58,237,0.3); display:flex; align-items:center; justify-content:center; gap:8px; margin-top:0.25rem; }
        .jd-btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div className="jd-pj">
        <div className="jd-pj-blob1" />
        <div className="jd-pj-blob2" />

        <div className="jd-pj-card">

          {/* Header */}
          <div className="jd-pj-header">
            <div className="jd-pj-header-icon"><BriefcaseBusiness size={24} color="white" /></div>
            <div>
              <p className="jd-pj-header-title">Post a New Job</p>
              <p className="jd-pj-header-sub">Publish an opening on JobDekho and reach thousands of candidates</p>
            </div>
          </div>

          {/* Body */}
          <div className="jd-pj-body">
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

              {/* Job Info section */}
              <div>
                <p className="jd-section-label">💼 Job Details</p>
                <div className="jd-pj-grid">
                  {/* Title */}
                  <div>
                    <label className="jd-field-label"><BriefcaseBusiness size={13} color="#a78bfa" /> Job Title <span>*</span></label>
                    <div className="jd-input-wrap">
                      <span className="jd-input-icon"><BriefcaseBusiness size={15} color="#a78bfa" /></span>
                      <input type="text" name="title" value={formData.title} onChange={handleChange}
                        placeholder="e.g., Senior Developer" className="jd-input" required />
                    </div>
                  </div>
                  {/* Company */}
                  <div>
                    <label className="jd-field-label"><Building2 size={13} color="#a78bfa" /> Company <span>*</span></label>
                    <div className="jd-input-wrap">
                      <span className="jd-input-icon"><Building2 size={15} color="#a78bfa" /></span>
                      <input type="text" name="company" value={formData.company} onChange={handleChange}
                        placeholder="e.g., Tech Solutions Inc." className="jd-input" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Salary */}
              <div>
                <p className="jd-section-label">📍 Location & Compensation</p>
                <div className="jd-pj-grid">
                  {/* Location */}
                  <div>
                    <label className="jd-field-label"><MapPin size={13} color="#a78bfa" /> Location <span>*</span></label>
                    <div className="jd-input-wrap">
                      <span className="jd-input-icon"><MapPin size={15} color="#a78bfa" /></span>
                      <input type="text" name="location" value={formData.location} onChange={handleChange}
                        placeholder="e.g., Remote, Bengaluru" className="jd-input" required />
                    </div>
                  </div>
                  {/* Salary */}
                  <div>
                    <label className="jd-field-label"><IndianRupee size={13} color="#a78bfa" /> Salary (INR/yr) <span>*</span></label>
                    <div className="jd-input-wrap">
                      <span className="jd-input-icon"><IndianRupee size={15} color="#a78bfa" /></span>
                      <input type="number" name="salary" value={formData.salary} onChange={handleChange}
                        placeholder="e.g., 800000" className="jd-input" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="jd-section-label"><AlignLeft size={12} /> Description</p>
                <label className="jd-field-label"><AlignLeft size={13} color="#a78bfa" /> Job Description <span>*</span></label>
                <div className="jd-input-wrap">
                  <span className="jd-textarea-icon"><AlignLeft size={15} color="#a78bfa" /></span>
                  <textarea name="description" value={formData.description} onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and requirements in detail..."
                    className="jd-textarea" required />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="jd-btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation:"jdSpin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-9-9"/>
                    </svg>
                    Posting Job...
                  </>
                ) : (
                  <><Send size={17} /> Post Job</>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostJob;