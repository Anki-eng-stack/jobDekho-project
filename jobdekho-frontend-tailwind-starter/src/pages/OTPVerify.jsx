import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LockKeyhole, Mail, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";

export default function OTPVerify() {
  const navigate = useNavigate();
  const [email, setEmail]   = useState("");
  const [otp, setOtp]       = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.warn("Please request an OTP first.");
      navigate("/otp-request");
    }
    document.getElementById("otp-input")?.focus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      toast.success("OTP verified — you're logged in!");
      localStorage.removeItem("otpEmail");
      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "recruiter") navigate("/recruiter");
      else navigate("/applications");
    } catch (err) {
      console.error("OTP verification error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "OTP verification failed. Please check the OTP or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-otpv { font-family:'DM Sans',sans-serif; min-height:100vh; background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%); display:flex; align-items:center; justify-content:center; padding:2rem 1rem; position:relative; overflow:hidden; }
        .jd-otpv-blob1 { position:absolute; top:-80px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(167,139,250,0.22),transparent 70%); pointer-events:none; }
        .jd-otpv-blob2 { position:absolute; bottom:-100px; left:-80px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%); pointer-events:none; }

        .jd-otpv-card { position:relative; z-index:1; background:white; border-radius:22px; border:1.5px solid #ede9fe; width:100%; max-width:440px; box-shadow:0 20px 60px rgba(124,58,237,0.13); overflow:hidden; }

        /* Header */
        .jd-otpv-header { background:linear-gradient(135deg,#7c3aed,#4f46e5); padding:2rem; text-align:center; position:relative; overflow:hidden; }
        .jd-otpv-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-otpv-header::after  { content:''; position:absolute; bottom:-40px; left:-30px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-otpv-logo  { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.28); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; position:relative; z-index:1; animation:jdFloat 3.5s ease-in-out infinite; }
        .jd-otpv-title { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:900; color:white; margin:0 0 4px; z-index:1; position:relative; }
        .jd-otpv-sub   { font-size:0.8rem; color:#c4b5fd; margin:0; z-index:1; position:relative; }

        /* Body */
        .jd-otpv-body { padding:1.75rem 2rem 2rem; display:flex; flex-direction:column; gap:1.1rem; }

        /* Info card */
        .jd-otpv-info { background:#faf9ff; border:1.5px solid #ede9fe; border-radius:14px; padding:1rem 1.1rem; display:flex; align-items:flex-start; gap:0.75rem; }
        .jd-otpv-info-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#ede9fe,#ddd6fe); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .jd-otpv-info-text { font-size:0.875rem; color:#475569; line-height:1.6; margin:0; }
        .jd-otpv-info-text strong { color:#7c3aed; font-weight:600; }

        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.625rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }

        .jd-input-wrap { position:relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }

        .jd-input { font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px; padding:0.65rem 0.875rem 0.65rem 2.5rem; outline:none; transition:all 0.2s; width:100%; box-sizing:border-box; }
        .jd-input::placeholder { color:#c4b5fd; }
        .jd-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
        .jd-input-readonly { background:#f3f0ff; color:#7c3aed; cursor:not-allowed; border-color:#ede9fe; }

        /* OTP input special style */
        .jd-otp-input { font-family:'DM Mono',monospace; font-size:1.4rem; font-weight:700; letter-spacing:0.4em; text-align:center; padding:0.75rem 1rem; color:#7c3aed; background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px; outline:none; transition:all 0.2s; width:100%; box-sizing:border-box; }
        .jd-otp-input::placeholder { color:#ddd6fe; letter-spacing:0.2em; font-size:1rem; }
        .jd-otp-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.12); }

        .jd-btn-submit { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:12px; padding:0.875rem 1.5rem; width:100%; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(124,58,237,0.3); display:flex; align-items:center; justify-content:center; gap:8px; margin-top:0.25rem; }
        .jd-btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .jd-btn-back { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#7c3aed; background:transparent; border:1.5px solid #ede9fe; border-radius:10px; padding:0.6rem 1rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; }
        .jd-btn-back:hover { background:#f5f3ff; border-color:#c4b5fd; }

        /* OTP dots hint */
        .jd-otp-dots { display:flex; justify-content:center; gap:0.4rem; margin-top:0.5rem; }
        .jd-otp-dot  { width:10px; height:10px; border-radius:50%; border:2px solid #ddd6fe; transition:all 0.2s; }
        .jd-otp-dot.filled { background:#7c3aed; border-color:#7c3aed; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div className="jd-otpv">
        <div className="jd-otpv-blob1" />
        <div className="jd-otpv-blob2" />

        <div className="jd-otpv-card">

          {/* Header */}
          <div className="jd-otpv-header">
            <div className="jd-otpv-logo"><LockKeyhole size={26} color="white" /></div>
            <h1 className="jd-otpv-title">Verify OTP</h1>
            <p className="jd-otpv-sub">Enter the code sent to your email</p>
          </div>

          {/* Body */}
          <div className="jd-otpv-body">

            {/* Info card */}
            <div className="jd-otpv-info">
              <div className="jd-otpv-info-icon"><ShieldCheck size={17} color="#7c3aed" /></div>
              <p className="jd-otpv-info-text">
                A <strong>6-digit OTP</strong> was sent to your email. Enter it below to complete your secure login.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

              <div>
                <p className="jd-section-label">📧 Sending To</p>
                {/* Email — readonly */}
                <label className="jd-field-label"><Mail size={13} color="#a78bfa" /> Email Address</label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon"><Mail size={15} color="#a78bfa" /></span>
                  <input
                    type="email" id="email-verify" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="jd-input jd-input-readonly"
                    required readOnly
                    aria-label="Email address (pre-filled)"
                  />
                </div>
              </div>

              <div>
                <p className="jd-section-label">🔑 Your OTP</p>
                <label className="jd-field-label"><KeyRound size={13} color="#a78bfa" /> One-Time Password</label>
                <input
                  type="text" id="otp-input"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="jd-otp-input"
                  required maxLength="6"
                  pattern="\d{6}"
                  title="Please enter a 6-digit OTP"
                  aria-label="Enter the 6-digit One-Time Password"
                  inputMode="numeric"
                />
                {/* Visual fill dots */}
                <div className="jd-otp-dots">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`jd-otp-dot ${otp.length > i ? "filled" : ""}`} />
                  ))}
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
                    Verifying...
                  </>
                ) : (
                  <><LockKeyhole size={17} /> Verify & Login</>
                )}
              </button>

            </form>

            {/* Back */}
            <Link to="/otp-request" className="jd-btn-back">
              <ArrowLeft size={14} /> Request a new OTP
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}