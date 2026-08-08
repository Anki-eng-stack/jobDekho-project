import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, Mail, ShieldCheck } from "lucide-react";

const Footer = () => (
  <footer className="jd-footer">
    <div className="jd-footer-inner">
      <div className="jd-footer-intro">
        <Link to="/" className="jd-footer-brand"><span className="jd-footer-brand-mark"><BriefcaseBusiness size={16} /></span> JobDekho</Link>
        <p>A clearer way to discover work, manage applications, and build meaningful professional connections.</p>
        <span className="jd-footer-trust"><ShieldCheck size={14} /> Career tools built around your privacy</span>
      </div>
      <div><h3>Job seekers</h3><nav className="jd-footer-links"><Link to="/jobs">Find jobs <ArrowUpRight size={13} /></Link><Link to="/signup">Create an account <ArrowUpRight size={13} /></Link><Link to="/assistant">Career AI <ArrowUpRight size={13} /></Link><Link to="/reviews">Reviews <ArrowUpRight size={13} /></Link></nav></div>
      <div><h3>Employers</h3><nav className="jd-footer-links"><Link to="/signup">Join as a recruiter <ArrowUpRight size={13} /></Link><Link to="/recruiter/post-job">Post a job <ArrowUpRight size={13} /></Link><Link to="/recruiter">Recruiter hub <ArrowUpRight size={13} /></Link></nav></div>
      <div><h3>Need help?</h3><p className="jd-footer-help"><Mail size={15} /> Sign in to access the in-app assistant and get guidance for your next step.</p><Link to="/assistant" className="jd-footer-help-link">Open career AI <ArrowUpRight size={13} /></Link></div>
    </div>
    <div className="jd-footer-bottom">© {new Date().getFullYear()} JobDekho. Built for the next step in your career.</div>
  </footer>
);

export default Footer;
