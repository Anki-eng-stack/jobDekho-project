import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config/apiConfig";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user.id);
      toast.success("Welcome back to JobDekho");
      navigate(data.user.role === "recruiter" ? "/recruiter" : data.user.role === "admin" ? "/admin" : "/applications");
    } catch (error) { toast.error(error.response?.data?.error || "We couldn't sign you in. Please try again."); }
    finally { setLoading(false); }
  };

  return <section className="jd-auth-page"><div className="jd-auth-orb jd-auth-orb-one" /><div className="jd-auth-orb jd-auth-orb-two" /><div className="jd-auth-layout"><aside className="jd-auth-aside"><Link to="/" className="jd-auth-brand"><span><BriefcaseBusiness size={18} /></span> JobDekho</Link><div><p className="jd-auth-kicker">Welcome back</p><h1>Your next opportunity is <em>waiting.</em></h1><p>Pick up right where you left off—applications, messages, interviews, and every opportunity in one place.</p></div><div className="jd-auth-proof"><span><CheckCircle2 size={17} /> Track every application</span><span><CheckCircle2 size={17} /> Keep recruiter chats together</span><span><CheckCircle2 size={17} /> Get help from Career AI</span></div></aside><main className="jd-auth-card"><div className="jd-auth-card-head"><span className="jd-auth-icon"><LockKeyhole size={21} /></span><div><p>Sign in to JobDekho</p><h2>Welcome back</h2></div></div><form onSubmit={handleSubmit} className="jd-auth-form"><label>Email address <span className="jd-auth-input"><Mail size={17} /><input type="email" name="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@example.com" required /></span></label><label>Password <span className="jd-auth-input"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((show) => !show)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label><div className="jd-auth-options"><Link to="/forgot-password">Forgot password?</Link><Link to="/otp-request" onClick={() => formData.email && localStorage.setItem("otpEmail", formData.email)}>Use OTP instead</Link></div><button className="jd-auth-submit" type="submit" disabled={loading}>{loading ? "Signing you in…" : <>Sign in <ArrowRight size={17} /></>}</button></form><p className="jd-auth-switch">New to JobDekho? <Link to="/signup">Create a free account</Link></p><p className="jd-auth-security"><ShieldCheck size={14} /> Your account and activity are protected.</p></main></div></section>;
};

export default Login;
