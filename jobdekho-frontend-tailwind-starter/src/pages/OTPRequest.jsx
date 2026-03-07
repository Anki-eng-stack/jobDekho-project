import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { Mail, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";

export default function OTPRequest() {
  const navigate = useNavigate();
  const [email, setEmail]   = useState(localStorage.getItem("otpEmail") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) document.getElementById("email-otp-request")?.focus();
  }, [email]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email });
      localStorage.setItem("otpEmail", email);
      toast.success("A One-Time Password (OTP) has been sent to your email!");
      navigate("/otp-verify");
    } catch (err) {
      console.error("OTP request error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to send OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-otp { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; position:relative; overflow:hidden; }
        .jd-otp-blob1 { position:absolute; top:-80px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(167,139,250,0.22),transparent 70%); pointer-events:none; }
        .jd-otp-blob2 { position:absolute; bottom:-100px; left:-80px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%); pointer-events:none; }

        .jd-otp-card { position:relative; z-index:1; background:white; border-radius:22px; border:1.5px solid #ede9fe; width:100%; max-width:440px; box-shadow:0 20px 60px rgba(124,58,237,0.13); overflow:hidden; }

        .jd-otp-header { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:2rem; text-align:center; position:relative; overflow:hidden; }
        .jd-otp-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-otp-header::after  { content:''; position:absolute; bottom:-40px; left:-30px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-otp-logo  { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.28); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; position:relative; z-index:1; animation:jdFloat 3.5s ease-in-out infinite; }
        .jd-otp-title { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:900; color:white; margin:0 0 4px; z-index:1; position:relative; }
        .jd-otp-sub   { font-size:0.8rem; color:#c4b5fd; margin:0; z-index:1; position:relative; }

        .jd-otp-body { padding:1.75rem 2rem 2rem; display:flex; flex-direction:column; gap:1.1rem; }

        /* Info card */
        .jd-otp-info { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px; padding:1rem 1.1rem; display:flex; align-items:flex-start; gap:0.75rem; }
        .jd-otp-info-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#ede9fe,#ddd6fe); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .jd-otp-info-text { font-size:0.875rem; color:#475569; line-height:1.6; margin:0; }
        .jd-otp-info-text strong { color:#7c3aed; font-weight:600; }

        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.625rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .jd-field-label span { color:#ef4444; }

        .jd-input-wrap { position:relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }

        .jd-input { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px; padding:0.65rem 0.875rem 0.65rem 2.5rem; outline:none; transition:all 0.2s; width:100%; box-sizing:border-box; }
        .jd-input::placeholder { color:#c4b5fd; }
        .jd-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        .jd-btn-submit { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:12px; padding:0.875rem 1.5rem; width:100%; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(124,58,237,0.3); display:flex; align-items:center; justify-content:center; gap:8px; }
        .jd-btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .jd-btn-back { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#7c3aed; background:transparent; border:1.5px solid #ede9fe; border-radius:10px; padding:0.6rem 1rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-back:hover { background:#f5f3ff; border-color:#c4b5fd; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div className="jd-otp">
        <div className="jd-otp-blob1" />
        <div className="jd-otp-blob2" />

        <div className="jd-otp-card">

          {/* Header */}
          <div className="jd-otp-header">
            <div className="jd-otp-logo"><KeyRound size={26} color="white" /></div>
            <h1 className="jd-otp-title">Login via OTP</h1>
            <p className="jd-otp-sub">Secure, passwordless sign-in</p>
          </div>

          {/* Body */}
          <div className="jd-otp-body">

            {/* Info card */}
            <div className="jd-otp-info">
              <div className="jd-otp-info-icon"><ShieldCheck size={17} color="#7c3aed" /></div>
              <p className="jd-otp-info-text">
                Enter your <strong>registered email</strong> and we'll send you a one-time password for a quick, secure login.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

              <div>
                <p className="jd-section-label">✉️ Your Email</p>
                <label className="jd-field-label"><Mail size={13} color="#a78bfa" /> Email Address <span>*</span></label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon"><Mail size={15} color="#a78bfa" /></span>
                  <input
                    type="email"
                    id="email-otp-request"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="jd-input"
                    required
                    aria-label="Enter your email address to receive OTP"
                  />
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
                    Sending OTP...
                  </>
                ) : (
                  <><Mail size={17} /> Request OTP</>
                )}
              </button>

            </form>

            {/* Back to login */}
            <Link to="/login" className="jd-btn-back">
              <ArrowLeft size={14} /> Back to Login
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}