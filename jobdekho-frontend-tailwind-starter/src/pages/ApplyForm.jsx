import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, UploadCloud, CheckCircle } from "lucide-react";

const ApplyForm = () => {
  const { jobId }  = useParams();
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");
  const role       = localStorage.getItem("role");

  const [form, setForm] = useState({ name:"", email:"", marks:"", grade:"", experience:"", skills:"" });
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
    else toast.error("Please upload a PDF file.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (role !== "jobseeker") {
      toast.error("Only jobseekers can apply for jobs.");
      setLoading(false); navigate("/jobs"); return;
    }
    const { name, email, marks, grade, experience, skills } = form;
    if (!name || !email || !resumeFile) {
      toast.error("Name, email, and resume are required fields.");
      setLoading(false); return;
    }
    try {
      const existingRes = await axios.get("http://localhost:5000/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const alreadyApplied = (existingRes.data.applications || []).some(
        (app) => (app.jobId || app.job?._id) === jobId
      );
      if (alreadyApplied) {
        toast.info("You have already applied to this job.");
        navigate("/applications"); setLoading(false); return;
      }
    } catch (existingErr) {
      console.warn("Could not check existing applications before submit:", existingErr);
    }
    const formData = new FormData();
    formData.append("name", name); formData.append("email", email);
    formData.append("marks", marks); formData.append("grade", grade);
    formData.append("experience", experience); formData.append("skills", skills);
    formData.append("resume", resumeFile);
    try {
      await axios.post(`http://localhost:5000/api/applications/apply/${jobId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      console.error("Submission error:", err.response || err);
      toast.error(err.response?.data?.error || "Application submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Not allowed screen
  if (role !== "jobseeker") {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", fontFamily:"'DM Sans',sans-serif", padding:"1rem" }}>
          <div style={{ background:"white", borderRadius:20, border:"1.5px solid #ede9fe", padding:"3rem 2.5rem", textAlign:"center", maxWidth:420, boxShadow:"0 8px 32px rgba(124,58,237,0.1)" }}>
            <div style={{ width:64, height:64, borderRadius:18, background:"#fff1f2", border:"1.5px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem", fontSize:"2rem" }}>🚫</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:800, color:"#1e1b4b", margin:"0 0 0.5rem" }}>Not Allowed</h2>
            <p style={{ fontSize:"0.875rem", color:"#64748b", margin:"0 0 1.5rem", lineHeight:1.6 }}>Recruiters and admins cannot apply for jobs.</p>
            <button onClick={() => navigate("/jobs")} style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"white", border:"none", borderRadius:10, padding:"0.65rem 1.5rem", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}>
              Back to Jobs
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-apply { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; }

        .jd-apply-card {
          background:white; border-radius:22px; border:1.5px solid #ede9fe;
          width:100%; max-width:680px;
          box-shadow:0 12px 48px rgba(124,58,237,0.12);
          overflow:hidden;
        }

        .jd-apply-header {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1.75rem 2rem;
          display:flex; align-items:center; gap:1rem;
          position:relative; overflow:hidden;
        }
        .jd-apply-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-apply-header-icon { width:48px; height:48px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-apply-header-title { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800; color:white; margin:0 0 3px; z-index:1; }
        .jd-apply-header-sub   { font-size:0.82rem; color:#c4b5fd; margin:0; z-index:1; }

        .jd-apply-body { padding:2rem; display:flex; flex-direction:column; gap:1.25rem; }

        .jd-section-label {
          font-size:0.72rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.08em; color:#7c3aed;
          display:flex; align-items:center; gap:6px; margin-bottom:0.75rem;
        }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:block; }
        .jd-field-label span { color:#ef4444; }

        .jd-input, .jd-textarea {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem; outline:none; transition:all 0.2s;
          width:100%; box-sizing:border-box;
        }
        .jd-input::placeholder, .jd-textarea::placeholder { color:#c4b5fd; }
        .jd-input:focus, .jd-textarea:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
        .jd-textarea { resize:vertical; line-height:1.6; min-height:90px; }

        .jd-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        @media(max-width:580px){ .jd-grid-2{ grid-template-columns:1fr; } }

        /* Upload zone */
        .jd-upload-zone {
          border:2px dashed #c4b5fd; border-radius:14px;
          background:#faf9ff; padding:2rem 1rem;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.2s; text-align:center; gap:8px;
        }
        .jd-upload-zone:hover, .jd-upload-zone.dragover {
          border-color:#7c3aed; background:#f5f3ff;
          box-shadow:0 0 0 3px rgba(124,58,237,0.08);
        }
        .jd-upload-zone.has-file {
          border-color:#16a34a; background:#f0fdf4; border-style:solid;
        }
        .jd-upload-icon { color:#a78bfa; transition:transform 0.2s; }
        .jd-upload-zone:hover .jd-upload-icon { transform:translateY(-3px); }
        .jd-upload-title { font-size:0.875rem; font-weight:600; color:#374151; }
        .jd-upload-sub   { font-size:0.75rem; color:#94a3b8; }
        .jd-upload-file  { font-size:0.82rem; font-weight:600; color:#15803d; display:flex; align-items:center; gap:5px; }

        /* Submit */
        .jd-submit-btn {
          font-family:'Syne',sans-serif; font-size:1rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:12px; padding:0.9rem 1.5rem;
          width:100%; cursor:pointer; transition:all 0.2s;
          box-shadow:0 4px 16px rgba(124,58,237,0.3);
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .jd-submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
        @keyframes jdSpin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="jd-apply">
        <div className="jd-apply-card">

          {/* Header */}
          <div className="jd-apply-header">
            <div className="jd-apply-header-icon"><FileText size={22} color="white" /></div>
            <div>
              <p className="jd-apply-header-title">Apply for Job</p>
              <p className="jd-apply-header-sub">Fill in your details and upload your resume</p>
            </div>
          </div>

          <div className="jd-apply-body">
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

              {/* Personal Info */}
              <div>
                <p className="jd-section-label">👤 Personal Information</p>
                <div className="jd-grid-2">
                  <div>
                    <label className="jd-field-label">Full Name <span>*</span></label>
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="John Doe" className="jd-input" required />
                  </div>
                  <div>
                    <label className="jd-field-label">Email Address <span>*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="your.email@example.com" className="jd-input" required />
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <p className="jd-section-label">🎓 Academic Information</p>
                <div className="jd-grid-2">
                  <div>
                    <label className="jd-field-label">Marks / Percentage</label>
                    <input type="text" name="marks" value={form.marks} onChange={handleChange}
                      placeholder="e.g., 85 or 8.5 CGPA" className="jd-input" />
                  </div>
                  <div>
                    <label className="jd-field-label">Grade</label>
                    <input type="text" name="grade" value={form.grade} onChange={handleChange}
                      placeholder="e.g., A, B+, First Class" className="jd-input" />
                  </div>
                </div>
              </div>

              {/* Experience & Skills */}
              <div>
                <p className="jd-section-label">💼 Experience & Skills</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                  <div>
                    <label className="jd-field-label">Years of Experience</label>
                    <input type="number" name="experience" value={form.experience} onChange={handleChange}
                      placeholder="e.g., 2" className="jd-input" />
                  </div>
                  <div>
                    <label className="jd-field-label">Skills <span style={{ color:"#94a3b8", fontWeight:400 }}>(comma-separated)</span></label>
                    <textarea name="skills" value={form.skills} onChange={handleChange}
                      placeholder="e.g., JavaScript, React, Node.js, SQL" className="jd-textarea" />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <p className="jd-section-label">📄 Resume</p>
                <label
                  htmlFor="resume"
                  className={`jd-upload-zone ${dragOver ? "dragover" : ""} ${resumeFile ? "has-file" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {resumeFile ? (
                    <>
                      <CheckCircle size={32} color="#16a34a" />
                      <span className="jd-upload-file">
                        <CheckCircle size={14} /> {resumeFile.name}
                      </span>
                      <span className="jd-upload-sub">Click to change file</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={36} className="jd-upload-icon" />
                      <span className="jd-upload-title"><span style={{ color:"#7c3aed" }}>Click to upload</span> or drag & drop</span>
                      <span className="jd-upload-sub">PDF only · Max 5MB</span>
                    </>
                  )}
                  <input id="resume" type="file" name="resume" accept=".pdf"
                    onChange={handleFileChange} style={{ display:"none" }} required />
                </label>
              </div>

              {/* Submit */}
              <button type="submit" className="jd-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation:"jdSpin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-9-9"/>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyForm;