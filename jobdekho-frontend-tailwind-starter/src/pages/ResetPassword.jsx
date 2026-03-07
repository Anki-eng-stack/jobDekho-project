import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";

export default function ResetPassword() {
  const { token }    = useParams();
  const navigate     = useNavigate();
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [loading, setLoading]                 = useState(false);

  const passwordsMatch = confirmPassword === "" || newPassword === confirmPassword;
  const strength = newPassword.length === 0 ? 0
    : newPassword.length < 6 ? 1
    : newPassword.length < 10 ? 2
    : 3;
  const strengthMeta = [
    { label: "", color: "#e2e8f0" },
    { label: "Weak",   color: "#ef4444" },
    { label: "Fair",   color: "#f59e0b" },
    { label: "Strong", color: "#22c55e" },
  ][strength];

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match!"); return; }
    if (newPassword.length < 6)          { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { newPassword });
      toast.success("Password reset successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Password reset error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to reset password. Please try again or request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-rp { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; position:relative; overflow:hidden; }
        .jd-rp-blob1 { position:absolute; top:-80px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(167,139,250,0.22),transparent 70%); pointer-events:none; }
        .jd-rp-blob2 { position:absolute; bottom:-100px; left:-80px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%); pointer-events:none; }

        .jd-rp-card { position:relative; z-index:1; background:white; border-radius:22px; border:1.5px solid #ede9fe; width:100%; max-width:440px; box-shadow:0 20px 60px rgba(124,58,237,0.13); overflow:hidden; }

        /* Header */
        .jd-rp-header { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:2rem; text-align:center; position:relative; overflow:hidden; }
        .jd-rp-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-rp-header::after  { content:''; position:absolute; bottom:-40px; left:-30px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-rp-logo  { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.28); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; position:relative; z-index:1; animation:jdFloat 3.5s ease-in-out infinite; }
        .jd-rp-title { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:900; color:white; margin:0 0 4px; z-index:1; position:relative; }
        .jd-rp-sub   { font-size:0.8rem; color:#c4b5fd; margin:0; z-index:1; position:relative; }

        /* Body */
        .jd-rp-body { padding:1.75rem 2rem 2rem; display:flex; flex-direction:column; gap:1.1rem; }

        /* Info card */
        .jd-rp-info { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px; padding:1rem 1.1rem; display:flex; align-items:flex-start; gap:0.75rem; }
        .jd-rp-info-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#ede9fe,#ddd6fe); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .jd-rp-info-text { font-size:0.875rem; color:#475569; line-height:1.6; margin:0; }
        .jd-rp-info-text strong { color:#7c3aed; font-weight:600; }

        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.625rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .jd-field-label span { color:#ef4444; }

        .jd-input-wrap { position:relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }
        .jd-input-toggle { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; color:#a78bfa; transition:color 0.2s; }
        .jd-input-toggle:hover { color:#7c3aed; }

        .jd-input { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px; padding:0.65rem 2.5rem 0.65rem 2.5rem; outline:none; transition:all 0.2s; width:100%; box-sizing:border-box; }
        .jd-input::placeholder { color:#c4b5fd; }
        .jd-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
        .jd-input-error { border-color:#fca5a5 !important; box-shadow:0 0 0 3px rgba(239,68,68,0.08) !important; }

        /* Strength bar */
        .jd-strength { margin-top:6px; }
        .jd-strength-track { height:5px; background:#f3f0ff; border-radius:999px; overflow:hidden; margin-bottom:4px; }
        .jd-strength-fill  { height:100%; border-radius:999px; transition:width 0.3s, background 0.3s; }
        .jd-strength-label { font-size:0.72rem; font-weight:600; }

        /* Match indicator */
        .jd-match-hint { font-size:0.72rem; font-weight:600; margin-top:5px; display:flex; align-items:center; gap:4px; }

        .jd-btn-submit { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:12px; padding:0.875rem 1.5rem; width:100%; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(124,58,237,0.3); display:flex; align-items:center; justify-content:center; gap:8px; margin-top:0.25rem; }
        .jd-btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .jd-btn-back { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#7c3aed; background:transparent; border:1.5px solid #ede9fe; border-radius:10px; padding:0.6rem 1rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-back:hover { background:#f5f3ff; border-color:#c4b5fd; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div className="jd-rp">
        <div className="jd-rp-blob1" />
        <div className="jd-rp-blob2" />

        <div className="jd-rp-card">

          {/* Header */}
          <div className="jd-rp-header">
            <div className="jd-rp-logo"><KeyRound size={26} color="white" /></div>
            <h1 className="jd-rp-title">Reset Password</h1>
            <p className="jd-rp-sub">Choose a strong new password</p>
          </div>

          {/* Body */}
          <div className="jd-rp-body">

            {/* Info card */}
            <div className="jd-rp-info">
              <div className="jd-rp-info-icon"><ShieldCheck size={17} color="#7c3aed" /></div>
              <p className="jd-rp-info-text">
                Enter a <strong>new password</strong> below. It must be at least 6 characters long.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

              <div>
                <p className="jd-section-label">🔐 New Password</p>

                {/* New Password */}
                <label className="jd-field-label"><Lock size={13} color="#a78bfa" /> New Password <span>*</span></label>
                <div className="jd-input-wrap" style={{ marginBottom:"0.5rem" }}>
                  <span className="jd-input-icon"><Lock size={15} color="#a78bfa" /></span>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="jd-input" required minLength="6"
                  />
                  <button type="button" className="jd-input-toggle" onClick={() => setShowNew(p => !p)}
                    aria-label={showNew ? "Hide password" : "Show password"}>
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword.length > 0 && (
                  <div className="jd-strength">
                    <div className="jd-strength-track">
                      <div className="jd-strength-fill" style={{ width:`${(strength/3)*100}%`, background: strengthMeta.color }} />
                    </div>
                    <span className="jd-strength-label" style={{ color: strengthMeta.color }}>
                      {strengthMeta.label}
                    </span>
                  </div>
                )}

                {/* Confirm Password */}
                <label className="jd-field-label" style={{ marginTop:"0.75rem" }}><Lock size={13} color="#a78bfa" /> Confirm Password <span>*</span></label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon"><Lock size={15} color="#a78bfa" /></span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`jd-input ${!passwordsMatch ? "jd-input-error" : ""}`}
                    required minLength="6"
                  />
                  <button type="button" className="jd-input-toggle" onClick={() => setShowConfirm(p => !p)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Match hint */}
                {confirmPassword.length > 0 && (
                  <p className="jd-match-hint" style={{ color: passwordsMatch ? "#15803d" : "#dc2626" }}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="jd-btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation:"jdSpin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-9-9"/>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  <><ShieldCheck size={17} /> Set New Password</>
                )}
              </button>

            </form>

            {/* Back */}
            <Link to="/login" className="jd-btn-back">
              <ArrowLeft size={14} /> Back to Login
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}