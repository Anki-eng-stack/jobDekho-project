import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CalendarDays, UserRound, BriefcaseBusiness,
  CalendarCheck2, Video, MapPin, NotebookPen,
  Send, XCircle,
} from "lucide-react";

const ScheduleInterview = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp]   = useState(true);
  const [scheduling, setScheduling]   = useState(false);
  const [form, setForm] = useState({ date:"", mode:"online", location:"", notes:"" });
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      setLoadingApp(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/applications/${applicationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplication(res.data.application);
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        setForm(prev => ({ ...prev, date: defaultDate.toISOString().slice(0, 16) }));
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load application details.");
        navigate("/recruiter");
      } finally {
        setLoadingApp(false);
      }
    };
    fetchApplication();
  }, [applicationId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.mode || !form.location) {
      toast.error("Please fill in all required fields (Date, Mode, Location).");
      return;
    }
    if (!application) { toast.error("Application data not loaded."); return; }
    setScheduling(true);
    try {
      await axios.post(
        `http://localhost:5000/api/interviews`,
        {
          application: applicationId,
          job: application.job._id,
          applicant: application.user._id,
          recruiter: application.job.recruiter,
          date: form.date, mode: form.mode,
          location: form.location, notes: form.notes,
          jobTitle: application.job.title,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Interview scheduled successfully!");
      navigate(`/recruiter/jobs/${application.job._id}/applicants`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to schedule interview.");
    } finally {
      setScheduling(false);
    }
  };

  /* ── Loading ── */
  if (loadingApp) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", gap:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #ede9fe", borderTopColor:"#7c3aed", animation:"jdSpin 0.7s linear infinite" }} />
        <p style={{ fontSize:"0.9rem", color:"#7c3aed", fontWeight:600 }}>Loading application details...</p>
      </div>
    </>
  );

  /* ── Not Found ── */
  if (!application) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes jdFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", padding:"1rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ background:"white", borderRadius:20, border:"1.5px solid #ede9fe", padding:"3rem 2.5rem", textAlign:"center", maxWidth:420, boxShadow:"0 8px 32px rgba(124,58,237,0.1)" }}>
          <div style={{ animation:"jdFloat 3s ease-in-out infinite", marginBottom:"1.25rem" }}><XCircle size={52} color="#ef4444" style={{ margin:"0 auto" }} /></div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#1e1b4b", margin:"0 0 0.5rem" }}>Application Not Found</h2>
          <p style={{ fontSize:"0.875rem", color:"#64748b", margin:"0 0 1.5rem" }}>The application details could not be loaded.</p>
          <button onClick={() => navigate("/recruiter")} style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"white", border:"none", borderRadius:10, padding:"0.65rem 1.5rem", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", fontFamily:"'Syne',sans-serif", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}>Back to Dashboard</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-si { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; }

        .jd-si-card { background:white; border-radius:22px; border:1.5px solid #ede9fe; width:100%; max-width:580px; box-shadow:0 12px 48px rgba(124,58,237,0.12); overflow:hidden; }

        /* Header */
        .jd-si-header { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:1.6rem 2rem; display:flex; align-items:center; gap:1rem; position:relative; overflow:hidden; }
        .jd-si-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-si-header-icon  { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-si-header-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; position:relative; }
        .jd-si-header-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; position:relative; }

        .jd-si-body { padding:1.75rem 2rem; display:flex; flex-direction:column; gap:1.25rem; }

        /* Info card */
        .jd-si-info { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px; padding:1rem 1.1rem; display:flex; flex-direction:column; gap:0.5rem; }
        .jd-si-info-row   { display:flex; align-items:center; gap:0.625rem; font-size:0.875rem; }
        .jd-si-info-label { font-weight:600; color:#7c3aed; min-width:80px; display:flex; align-items:center; gap:5px; font-size:0.82rem; }
        .jd-si-info-value { color:#1e1b4b; font-weight:500; }
        .jd-si-info-divider { height:1px; background:#f3f0ff; }

        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.625rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .jd-field-label span { color:#ef4444; }

        .jd-input-wrap { position:relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }
        .jd-textarea-icon { position:absolute; left:0.75rem; top:0.75rem; pointer-events:none; }

        .jd-input, .jd-textarea, .jd-select {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem 0.65rem 2.5rem; outline:none; transition:all 0.2s;
          width:100%; box-sizing:border-box;
        }
        .jd-input::placeholder, .jd-textarea::placeholder { color:#c4b5fd; }
        .jd-input:focus, .jd-textarea:focus, .jd-select:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
        .jd-textarea { resize:vertical; min-height:100px; line-height:1.6; padding-top:0.65rem; }

        /* Mode toggle */
        .jd-mode-toggle { display:flex; gap:0.625rem; }
        .jd-mode-btn { flex:1; padding:0.65rem; border-radius:10px; border:1.5px solid #ede9fe; background:#faf9ff; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:6px; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#64748b; }
        .jd-mode-btn.active-online  { border-color:#7c3aed; background:#f5f3ff; color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.08); }
        .jd-mode-btn.active-offline { border-color:#16a34a; background:#f0fdf4; color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.08); }

        .jd-btn-submit { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:12px; padding:0.875rem 1.5rem; width:100%; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(124,58,237,0.3); display:flex; align-items:center; justify-content:center; gap:8px; margin-top:0.25rem; }
        .jd-btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
      `}</style>

      <div className="jd-si">
        <div className="jd-si-card">

          {/* Header */}
          <div className="jd-si-header">
            <div className="jd-si-header-icon"><CalendarDays size={20} color="white" /></div>
            <div>
              <p className="jd-si-header-title">Schedule Interview</p>
              <p className="jd-si-header-sub">Set up an interview for the applicant below</p>
            </div>
          </div>

          <div className="jd-si-body">

            {/* Info card */}
            <div className="jd-si-info">
              <div className="jd-si-info-row">
                <span className="jd-si-info-label"><UserRound size={13} /> Applicant</span>
                <span className="jd-si-info-value">{application.user?.name || "N/A"}</span>
              </div>
              <div className="jd-si-info-divider" />
              <div className="jd-si-info-row">
                <span className="jd-si-info-label"><BriefcaseBusiness size={13} /> Job</span>
                <span className="jd-si-info-value">{application.job?.title || "N/A"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>

              {/* Date & Time */}
              <div>
                <p className="jd-section-label">📅 Schedule</p>
                <label className="jd-field-label"><CalendarCheck2 size={13} color="#a78bfa" /> Date & Time <span>*</span></label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon"><CalendarCheck2 size={15} color="#a78bfa" /></span>
                  <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="jd-input" required />
                </div>
              </div>

              {/* Mode toggle */}
              <div>
                <p className="jd-section-label">🎯 Interview Mode</p>
                <div className="jd-mode-toggle">
                  <button type="button"
                    className={`jd-mode-btn ${form.mode === "online" ? "active-online" : ""}`}
                    onClick={() => setForm(p => ({ ...p, mode:"online" }))}>
                    <Video size={15} /> Online
                  </button>
                  <button type="button"
                    className={`jd-mode-btn ${form.mode === "offline" ? "active-offline" : ""}`}
                    onClick={() => setForm(p => ({ ...p, mode:"offline" }))}>
                    <MapPin size={15} /> In-Person
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="jd-field-label">
                  {form.mode === "online"
                    ? <><Video size={13} color="#7c3aed" /> Meeting Link <span>*</span></>
                    : <><MapPin size={13} color="#16a34a" /> Physical Location <span>*</span></>}
                </label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon">
                    {form.mode === "online" ? <Video size={15} color="#7c3aed" /> : <MapPin size={15} color="#16a34a" />}
                  </span>
                  <input type="text" name="location" value={form.location} onChange={handleChange}
                    placeholder={form.mode === "online" ? "https://meet.google.com/xyz" : "123 Main St, Office Address"}
                    className="jd-input" required />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="jd-field-label">
                  <NotebookPen size={13} color="#a78bfa" /> Notes
                  <span style={{ color:"#94a3b8", fontWeight:400 }}>(optional)</span>
                </label>
                <div className="jd-input-wrap">
                  <span className="jd-textarea-icon"><NotebookPen size={15} color="#a78bfa" /></span>
                  <textarea name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Add any instructions or details for the applicant..."
                    className="jd-textarea" />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="jd-btn-submit" disabled={scheduling}>
                {scheduling ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation:"jdSpin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-9-9"/>
                    </svg>
                    Scheduling...
                  </>
                ) : (
                  <><Send size={17} /> Schedule Interview</>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleInterview;