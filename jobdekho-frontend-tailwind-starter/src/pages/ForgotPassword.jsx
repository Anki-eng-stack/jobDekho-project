import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { Mail, Send, KeyRound, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/request-reset", { email });
      toast.success("A password reset link has been sent to your email address!");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to send reset link. Please check your email or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-fp { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; }

        .jd-fp-card {
          background:white; border-radius:22px; border:1.5px solid #ede9fe;
          width:100%; max-width:480px;
          box-shadow:0 12px 48px rgba(124,58,237,0.12); overflow:hidden;
        }

        .jd-fp-header {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1.6rem 2rem; display:flex; align-items:center; gap:1rem;
          position:relative; overflow:hidden;
        }
        .jd-fp-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-fp-header::after  { content:''; position:absolute; bottom:-40px; left:-30px; width:120px; height:120px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-fp-header-icon  { width:46px; height:46px; border-radius:13px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
        .jd-fp-header-title { font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:white; margin:0 0 2px; z-index:1; }
        .jd-fp-header-sub   { font-size:0.78rem; color:#c4b5fd; margin:0; z-index:1; }

        .jd-fp-body { padding:1.75rem 2rem; display:flex; flex-direction:column; gap:1.25rem; }

        .jd-fp-desc {
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px;
          padding:1rem 1.1rem; display:flex; align-items:flex-start; gap:0.75rem;
        }
        .jd-fp-desc-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#ede9fe,#ddd6fe); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .jd-fp-desc-text { font-size:0.875rem; color:#475569; line-height:1.6; margin:0; }
        .jd-fp-desc-text strong { color:#7c3aed; font-weight:600; }

        .jd-section-label {
          font-size:0.72rem; font-weight:700; text-transform:uppercase;
          letter-spacing:0.08em; color:#7c3aed;
          display:flex; align-items:center; gap:6px; margin-bottom:0.625rem;
        }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .jd-field-label span { color:#ef4444; }

        .jd-input-wrap { position:relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }

        .jd-input {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem 0.65rem 2.5rem; outline:none; transition:all 0.2s;
          width:100%; box-sizing:border-box;
        }
        .jd-input::placeholder { color:#c4b5fd; }
        .jd-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

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

        .jd-back-btn {
          font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600;
          color:#7c3aed; background:transparent; border:1.5px solid #ede9fe;
          border-radius:10px; padding:0.6rem 1rem;
          cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:6px;
          text-decoration:none;
        }
        .jd-back-btn:hover { background:#f5f3ff; border-color:#c4b5fd; }

        @keyframes jdSpin { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>

      <div className="jd-fp">
        <div className="jd-fp-card">

          {/* Header */}
          <div className="jd-fp-header">
            <div className="jd-fp-header-icon">
              <KeyRound size={20} color="white" />
            </div>
            <div>
              <p className="jd-fp-header-title">Forgot Password?</p>
              <p className="jd-fp-header-sub">We'll send you a reset link right away</p>
            </div>
          </div>

          <div className="jd-fp-body">

            {/* Description card */}
            <div className="jd-fp-desc">
              <div className="jd-fp-desc-icon">
                <Mail size={17} color="#7c3aed" />
              </div>
              <p className="jd-fp-desc-text">
                Enter your registered <strong>email address</strong> below and we'll send you a secure link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>

              {/* Email field */}
              <div>
                <p className="jd-section-label">✉️ Account Email</p>
                <label className="jd-field-label">
                  <Mail size={13} color="#a78bfa" /> Email Address <span>*</span>
                </label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon"><Mail size={15} color="#a78bfa" /></span>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="jd-input"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="jd-submit-btn" disabled={loading} style={{ marginTop:"0.25rem" }}>
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation:"jdSpin 0.7s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-9-9"/>
                    </svg>
                    Sending Reset Link...
                  </>
                ) : (
                  <><Send size={17}/> Send Reset Link</>
                )}
              </button>

              {/* Back link */}
              <button type="button" className="jd-back-btn" onClick={() => navigate("/login")}>
                <ArrowLeft size={14}/> Back to Login
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}