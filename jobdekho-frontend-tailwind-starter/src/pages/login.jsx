import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn, KeyRound, BriefcaseBusiness } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      toast.success("Login successful");
      if (user.role === "recruiter") navigate("/recruiter");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/applications");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-login {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem;
          position: relative; overflow: hidden;
        }
        .jd-login-blob1 { position:absolute; top:-80px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(167,139,250,0.22),transparent 70%); pointer-events:none; }
        .jd-login-blob2 { position:absolute; bottom:-100px; left:-80px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%); pointer-events:none; }

        .jd-login-card {
          position: relative; z-index: 1;
          background: white; border-radius: 22px;
          border: 1.5px solid #ede9fe;
          width: 100%; max-width: 440px;
          box-shadow: 0 20px 60px rgba(124,58,237,0.13);
          overflow: hidden;
        }

        /* Header */
        .jd-login-header {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          padding: 2rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .jd-login-header::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .jd-login-header::after  { content:''; position:absolute; bottom:-40px; left:-30px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .jd-login-logo { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.28); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; position:relative; z-index:1; animation:jdFloat 3.5s ease-in-out infinite; }
        .jd-login-title { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:900; color:white; margin:0 0 4px; z-index:1; position:relative; }
        .jd-login-sub   { font-size:0.8rem; color:#c4b5fd; margin:0; z-index:1; position:relative; }

        /* Body */
        .jd-login-body { padding: 1.75rem 2rem 2rem; display: flex; flex-direction: column; gap: 1.1rem; }

        .jd-section-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7c3aed; display:flex; align-items:center; gap:6px; margin-bottom:0.625rem; }
        .jd-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#ede9fe,transparent); }

        .jd-field-label { font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:4px; display:flex; align-items:center; gap:5px; }

        .jd-input-wrap { position: relative; }
        .jd-input-icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); pointer-events:none; }

        .jd-input {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:10px;
          padding:0.65rem 0.875rem 0.65rem 2.5rem;
          outline:none; transition:all 0.2s; width:100%; box-sizing:border-box;
        }
        .jd-input::placeholder { color:#c4b5fd; }
        .jd-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        /* Buttons */
        .jd-btn-submit {
          font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700;
          color:white; background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; border-radius:12px; padding:0.875rem 1.5rem;
          width:100%; cursor:pointer; transition:all 0.2s;
          box-shadow:0 4px 16px rgba(124,58,237,0.3);
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .jd-btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.42); }
        .jd-btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .jd-alt-btns { display:grid; grid-template-columns:1fr 1fr; gap:0.625rem; }
        .jd-btn-alt {
          font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:600;
          color:#7c3aed; background:white; border:1.5px solid #ddd6fe;
          border-radius:10px; padding:0.65rem 0.5rem; cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:6px;
          text-decoration:none; text-align:center;
        }
        .jd-btn-alt:hover { background:#f5f3ff; border-color:#a78bfa; transform:translateY(-1px); }

        .jd-signup-text { text-align:center; font-size:0.82rem; color:#64748b; }
        .jd-signup-link { color:#7c3aed; font-weight:700; text-decoration:none; }
        .jd-signup-link:hover { text-decoration:underline; }

        @keyframes jdSpin  { to{transform:rotate(360deg)} }
        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div className="jd-login">
        <div className="jd-login-blob1" />
        <div className="jd-login-blob2" />

        <div className="jd-login-card">

          {/* Header */}
          <div className="jd-login-header">
            <div className="jd-login-logo"><BriefcaseBusiness size={26} color="white" /></div>
            <h1 className="jd-login-title">Welcome Back</h1>
            <p className="jd-login-sub">Login to continue on JobDekho</p>
          </div>

          {/* Body */}
          <div className="jd-login-body">

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

              <div>
                <p className="jd-section-label">🔐 Your Credentials</p>

                {/* Email */}
                <label className="jd-field-label"><Mail size={13} color="#a78bfa" /> Email Address</label>
                <div className="jd-input-wrap" style={{ marginBottom:"0.75rem" }}>
                  <span className="jd-input-icon"><Mail size={15} color="#a78bfa" /></span>
                  <input type="email" name="email" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange}
                    className="jd-input" required />
                </div>

                {/* Password */}
                <label className="jd-field-label"><Lock size={13} color="#a78bfa" /> Password</label>
                <div className="jd-input-wrap">
                  <span className="jd-input-icon"><Lock size={15} color="#a78bfa" /></span>
                  <input type="password" name="password" placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    className="jd-input" required />
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
                    Logging in...
                  </>
                ) : (
                  <><LogIn size={17} /> Login</>
                )}
              </button>

            </form>

            {/* Alt login options */}
            <div className="jd-alt-btns">
              <Link to="/forgot-password" className="jd-btn-alt">
                <Lock size={13} /> Forgot Password
              </Link>
              <Link to="/otp-request" className="jd-btn-alt"
                onClick={() => { if (formData.email) localStorage.setItem("otpEmail", formData.email); }}>
                <KeyRound size={13} /> Login via OTP
              </Link>
            </div>

            {/* Sign up */}
            <p className="jd-signup-text">
              Don't have an account?{" "}
              <Link to="/signup" className="jd-signup-link">Sign up</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;