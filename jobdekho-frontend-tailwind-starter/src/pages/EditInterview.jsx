import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserRound, BriefcaseBusiness, CalendarCheck2,
  Video, MapPin, NotebookPen, Save, Loader2,
  Edit, XCircle, CheckCircle,
} from "lucide-react";

const EditInterview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [interview, setInterview]           = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savingChanges, setSavingChanges]   = useState(false);

  const [form, setForm] = useState({
    date: "", mode: "online", location: "", notes: "", status: "scheduled",
  });

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      setLoadingInitial(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/interviews/${interviewId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const f = res.data;
        setInterview(f);
        setForm({
          date: f.date ? new Date(f.date).toISOString().slice(0, 16) : "",
          mode: f.mode || "online",
          location: f.location || "",
          notes: f.notes || "",
          status: f.status || "scheduled",
        });
        toast.success("Interview details loaded!");
      } catch (err) {
        console.error("Failed to load interview details:", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Failed to load interview details.");
        navigate("/recruiter");
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchInterviewDetails();
  }, [interviewId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingChanges(true);
    if (!form.date || !form.mode || !form.location) {
      toast.error("Please fill in all required fields (Date, Mode, Location).");
      setSavingChanges(false); return;
    }
    try {
      await axios.put(`http://localhost:5000/api/interviews/${interviewId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Interview updated successfully!");
      const jobId = interview?.application?.job?._id || interview?.job?._id;
      navigate(jobId ? `/recruiter/jobs/${jobId}/applicants` : "/recruiter");
    } catch (err) {
      console.error("Failed to update interview:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to update interview.");
    } finally {
      setSavingChanges(false);
    }
  };

  if (loadingInitial) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", gap:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #ede9fe", borderTopColor:"#7c3aed", animation:"jdSpin 0.7s linear infinite" }} />
          <p style={{ fontSize:"0.95rem", color:"#7c3aed", fontWeight:600 }}>Loading interview details...</p>
        </div>
      </>
    );
  }

  if (!interview) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", padding:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ background:"white", borderRadius:20, border:"1.5px solid #ede9fe", padding:"3rem 2.5rem", textAlign:"center", maxWidth:420, boxShadow:"0 8px 32px rgba(124,58,237,0.1)" }}>
            <div style={{ animation:"jdFloat 3s ease-in-out infinite", marginBottom:"1.25rem" }}>
              <XCircle size={56} color="#ef4444" style={{ margin:"0 auto" }} />
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#1e1b4b", margin:"0 0 0.5rem" }}>Interview Not Found</h2>
            <p style={{ fontSize:"0.875rem", color:"#64748b", margin:"0 0 1.5rem" }}>The interview details could not be loaded.</p>
            <button onClick={() => navigate("/recruiter")} style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"white", border:"none", borderRadius:10, padding:"0.65rem 1.5rem", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const statusConfig = {
    scheduled: { icon: <CalendarCheck2 size={16} color="#1d4ed8"/>, bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe" },
    completed: { icon: <CheckCircle    size={16} color="#15803d"/>, bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0" },
    cancelled: { icon: <XCircle        size={16} color="#dc2626"/>, bg:"#fff1f2", color:"#dc2626", border:"#fecaca" },
  };
  const sc = statusConfig[form.status] || statusConfig.scheduled;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-ei { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; }

        .jd-ei-card {
          background:white; border-radius:22px; border:1.5px solid #ede9fe;
          width:100%; max-width:580px;
          box-shadow:0 12px 48px rgba(124,58,237,0.12); overflow:hidden;
        }

        .jd-ei-header {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1.6rem 2rem; display:flex; align-items:center; gap:1rem;
          position:relative; overflow:hidden;
        }
        .jd-ei-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-ei-header-icon  { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-ei-header-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; }
        .jd-ei-header-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; }

        .jd-ei-body { padding:1.75rem 2rem; display:flex; flex-direction:column; gap:1.25rem; }

        /* Info card */
        .jd-ei-info {
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px;
          padding:1rem 1.1rem; display:flex; flex-direction:column; gap:0.5rem;
        }
        .jd-ei-info-row { display:flex; align-items:center; gap:0.625rem; font-size:0.875rem; }
        .jd-ei-info-label { font-weight:600; color:#7c3aed; min-width:80px; display:flex; align-items:center; gap:5px; font-size:0.82rem; }
        .jd-ei-info-value { color:#1e1b4b; font-weight:500; }

        .jd-section-label {
          font-size:0.72rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.08em; color:#7c3aed;
          display:flex; align-items:center; gap:6px; margin-bottom:0.625rem;
        }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .jd-field-label span { color:#ef4444; }

        .jd-input, .jd-textarea, .jd-select {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem; outline:none; transition:all 0.2s;
          width:100%; box-sizing:border-box;
        }
        .jd-input::placeholder, .jd-textarea::placeholder { color:#c4b5fd; }
        .jd-input:focus, .jd-textarea:focus, .jd-select:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
        .jd-textarea { resize:vertical; min-height:100px; line-height:1.6; }

        .jd-select-wrap { position:relative; }
        .jd-select-wrap::after { content:''; position:absolute; right:12px; top:50%; transform:translateY(-50%); border-left:4px solid transparent; border-right:4px solid transparent; border-top:5px solid #7c3aed; pointer-events:none; }
        .jd-select { appearance:none; -webkit-appearance:none; padding-left:2.5rem; padding-right:2rem; }
        .jd-select-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }

        /* Mode toggle */
        .jd-mode-toggle { display:flex; gap:0.625rem; }
        .jd-mode-btn {
          flex:1; padding:0.65rem; border-radius:10px; border:1.5px solid #ede9fe;
          background:#faf9ff; cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#64748b;
        }
        .jd-mode-btn.active-online  { border-color:#7c3aed; background:#f5f3ff; color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.08); }
        .jd-mode-btn.active-offline { border-color:#16a34a; background:#f0fdf4; color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.08); }

        /* Status pill select */
        .jd-status-select-wrap { position:relative; }
        .jd-status-display {
          display:flex; align-items:center; gap:8px;
          padding:0.65rem 1rem; border-radius:10px; border:1.5px solid;
          background:; cursor:pointer; transition:all 0.2s;
          font-size:0.875rem; font-weight:600;
        }

        .jd-submit-btn {
          font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:12px; padding:0.875rem 1.5rem;
          width:100%; cursor:pointer; transition:all 0.2s;
          box-shadow:0 4px 16px rgba(124,58,237,0.3);
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .jd-submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-submit-btn:disabled { opacity:0.6; cursor:not-allowed; }

        @keyframes jdSpin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="jd-ei">
        <div className="jd-ei-card">

          {/* Header */}
          <div className="jd-ei-header">
            <div className="jd-ei-header-icon"><Edit size={20} color="white" /></div>
            <div>
              <p className="jd-ei-header-title">Edit Interview</p>
              <p className="jd-ei-header-sub">Update interview details for the applicant</p>
            </div>
          </div>

          <div className="jd-ei-body">

            {/* Info card — read only */}
            <div className="jd-ei-info">
              <div className="jd-ei-info-row">
                <span className="jd-ei-info-label"><UserRound size={13}/>Applicant</span>
                <span className="jd-ei-info-value">{interview.applicant?.name || "N/A"}</span>
              </div>
              <div style={{ height:1, background:"#f3f0ff" }} />
              <div className="jd-ei-info-row">
                <span className="jd-ei-info-label"><BriefcaseBusiness size={13}/>Job</span>
                <span className="jd-ei-info-value">{interview.job?.title || interview.jobTitle || "N/A"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>

              {/* Date & Time */}
              <div>
                <p className="jd-section-label">📅 Schedule</p>
                <label className="jd-field-label"><CalendarCheck2 size={13} color="#a78bfa"/> Date & Time <span>*</span></label>
                <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="jd-input" required />
              </div>

              {/* Mode toggle */}
              <div>
                <p className="jd-section-label">🎯 Interview Mode</p>
                <div className="jd-mode-toggle">
                  <button type="button"
                    className={`jd-mode-btn ${form.mode === "online" ? "active-online" : ""}`}
                    onClick={() => setForm(p => ({ ...p, mode:"online" }))}
                  >
                    <Video size={15}/> Online
                  </button>
                  <button type="button"
                    className={`jd-mode-btn ${form.mode === "offline" ? "active-offline" : ""}`}
                    onClick={() => setForm(p => ({ ...p, mode:"offline" }))}
                  >
                    <MapPin size={15}/> In-Person
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="jd-field-label">
                  {form.mode === "online"
                    ? <><Video size={13} color="#7c3aed"/> Meeting Link <span>*</span></>
                    : <><MapPin size={13} color="#16a34a"/> Physical Location <span>*</span></>
                  }
                </label>
                <input type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder={form.mode === "online" ? "https://meet.google.com/xyz" : "123 Main St, Office Address"}
                  className="jd-input" required />
              </div>

              {/* Notes */}
              <div>
                <label className="jd-field-label"><NotebookPen size={13} color="#a78bfa"/> Notes <span style={{ color:"#94a3b8", fontWeight:400 }}>(optional)</span></label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Add any specific instructions or details for the applicant..."
                  className="jd-textarea" />
              </div>

              {/* Status */}
              <div>
                <p className="jd-section-label">🏷️ Status</p>
                <div className="jd-select-wrap">
                  <span className="jd-select-icon">{sc.icon}</span>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="jd-select"
                    style={{ borderColor: sc.border, background: sc.bg, color: sc.color }}
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="jd-submit-btn" disabled={savingChanges} style={{ marginTop:"0.25rem" }}>
                {savingChanges ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation:"jdSpin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-9-9"/>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <><Save size={17}/> Save Changes</>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInterview;