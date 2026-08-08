import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Bot, BriefcaseBusiness, Building2, CheckCircle2, Clock3, IndianRupee, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, UserRoundCheck, UsersRound } from "lucide-react";
import API from "../services/api";

const categories = [
  { label: "Technology", icon: "⌘", query: "developer" },
  { label: "Design", icon: "✦", query: "design" },
  { label: "Marketing", icon: "↗", query: "marketing" },
  { label: "Business", icon: "◈", query: "manager" },
];

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/jobs").then(({ data }) => setJobs(Array.isArray(data) ? data : [])).catch(() => setJobs([]));
  }, []);

  const featured = useMemo(() => jobs.slice(0, 3), [jobs]);
  const searchJobs = (event) => {
    event.preventDefault();
    navigate(search.trim() ? `/jobs?q=${encodeURIComponent(search.trim())}` : "/jobs");
  };

  return (
    <div className="jd-landing">
      <section className="jd-landing-hero">
        <div className="jd-hero-orb jd-hero-orb-one" /><div className="jd-hero-orb jd-hero-orb-two" />
        <div className="jd-hero-content">
          <div className="jd-hero-copy jd-reveal">
            <p className="jd-eyebrow"><Sparkles size={14} /> India&apos;s career companion</p>
            <h1>Find work that<br /><em>moves you forward.</em></h1>
            <p className="jd-hero-description">Discover relevant roles, apply with confidence, and keep every career conversation in one simple place.</p>
            <form className="jd-search-panel" onSubmit={searchJobs}>
              <label><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Job title, skill, or company" aria-label="Search jobs" /></label>
              <button type="submit">Find jobs <ArrowRight size={17} /></button>
            </form>
            <div className="jd-hero-trust"><span><CheckCircle2 size={15} /> Verified listings</span><span><CheckCircle2 size={15} /> Direct applications</span><span><CheckCircle2 size={15} /> Real-time updates</span></div>
          </div>

          <div className="jd-hero-visual jd-reveal jd-reveal-late" aria-label="Job search preview">
            <div className="jd-hero-card jd-hero-card-main">
              <div className="jd-card-topline"><span className="jd-live-dot" /> New opportunities today <BadgeCheck size={16} /></div>
              <div className="jd-role-icon"><BriefcaseBusiness size={27} /></div>
              <p className="jd-role-label">Featured opportunity</p>
              <h2>{featured[0]?.title || "Build your next big thing"}</h2>
              <p className="jd-role-company"><Building2 size={15} /> {featured[0]?.company || "Trusted companies are hiring"}</p>
              <div className="jd-role-tags"><span><MapPin size={13} /> {featured[0]?.location || "India"}</span><span><IndianRupee size={13} /> {featured[0]?.salary ? Number(featured[0].salary).toLocaleString("en-IN") : "Competitive"}</span></div>
              <Link to={featured[0]?._id ? `/jobs/${featured[0]._id}` : "/jobs"} className="jd-view-role">Explore role <ArrowRight size={15} /></Link>
            </div>
            <div className="jd-hero-mini jd-hero-mini-one"><span className="jd-mini-icon jd-mini-green"><UserRoundCheck size={17} /></span><div><b>Application tracking</b><small>Every step, clearly visible</small></div></div>
            <div className="jd-hero-mini jd-hero-mini-two"><span className="jd-mini-icon jd-mini-violet"><Bot size={17} /></span><div><b>Career AI</b><small>Helpful answers, on demand</small></div></div>
          </div>
        </div>
        <div className="jd-hero-stats"><div><strong>{jobs.length || "—"}</strong><span>live jobs</span></div><div><strong>1</strong><span>place to manage your career</span></div><div><strong>24/7</strong><span>career support with AI</span></div></div>
      </section>

      <section className="jd-home-section jd-category-section">
        <div className="jd-section-heading"><div><p className="jd-eyebrow"><Sparkles size={14} /> Find your direction</p><h2>Browse by what<br /><em>you do best.</em></h2></div><Link to="/jobs" className="jd-text-link">Explore all roles <ArrowRight size={16} /></Link></div>
        <div className="jd-category-grid">{categories.map((category) => <button key={category.label} type="button" className="jd-category-card" onClick={() => navigate(`/jobs?q=${category.query}`)}><span>{category.icon}</span><div><b>{category.label}</b><small>Explore openings</small></div><ArrowRight size={17} /></button>)}</div>
      </section>

      <section className="jd-home-section jd-featured-section">
        <div className="jd-section-heading"><div><p className="jd-eyebrow"><BriefcaseBusiness size={14} /> Fresh from JobDekho</p><h2>Opportunities worth<br /><em>taking a closer look.</em></h2></div><Link to="/jobs" className="jd-text-link">See all jobs <ArrowRight size={16} /></Link></div>
        <div className="jd-featured-grid">
          {(featured.length ? featured : [{ _id: "browse", title: "Your next role could be here", company: "New opportunities arrive every day", location: "Across India" }]).map((job, index) => <article key={job._id} className="jd-featured-card" style={{ animationDelay: `${index * 90}ms` }}><div className="jd-featured-card-top"><span className="jd-company-mark">{job.company?.charAt(0)?.toUpperCase() || "J"}</span><span className="jd-new-badge">New opening</span></div><h3>{job.title}</h3><p><Building2 size={14} /> {job.company}</p><p><MapPin size={14} /> {job.location || "Location flexible"}</p><div className="jd-featured-bottom"><span>{job.salary ? `₹${Number(job.salary).toLocaleString("en-IN")}` : "Salary on request"}</span><Link to={job._id === "browse" ? "/jobs" : `/jobs/${job._id}`} aria-label={`View ${job.title}`}><ArrowRight size={17} /></Link></div></article>)}</div>
      </section>

      <section className="jd-home-section jd-how-section"><div className="jd-how-copy"><p className="jd-eyebrow"><Clock3 size={14} /> Simple from search to success</p><h2>Your job search,<br /><em>without the chaos.</em></h2><p>JobDekho gives job seekers a clear, well-organised path and gives recruiters the tools to hire without unnecessary admin.</p><Link to="/signup" className="jd-solid-link">Create your free account <ArrowRight size={16} /></Link></div><div className="jd-how-steps"><article><span>01</span><div><h3>Discover relevant roles</h3><p>Use meaningful search to find jobs that fit your experience and ambitions.</p></div></article><article><span>02</span><div><h3>Apply with confidence</h3><p>Send your application and keep the important details together.</p></div></article><article><span>03</span><div><h3>Stay ahead of each step</h3><p>Track updates, interviews, and recruiter conversations in your dashboard.</p></div></article></div></section>

      <section className="jd-workspace-band">
        <div className="jd-workspace-inner">
          <div><p className="jd-eyebrow"><ShieldCheck size={14} /> One secure workspace</p><h2>Everything important stays <em>within reach.</em></h2></div>
          <div className="jd-workspace-items"><span><BadgeCheck size={19} /><b>Verified opportunities</b><small>Clear details before you apply.</small></span><span><MessageCircle size={19} /><b>Direct conversations</b><small>Keep recruiter chats in context.</small></span><span><Clock3 size={19} /><b>Timely progress</b><small>Know what happens next.</small></span></div>
        </div>
      </section>

      <section className="jd-home-section jd-paths-section">
        <div className="jd-section-heading"><div><p className="jd-eyebrow"><UsersRound size={14} /> Built for both sides of hiring</p><h2>A better experience,<br /><em>whatever your goal.</em></h2></div></div>
        <div className="jd-path-grid">
          <article className="jd-path-card jd-path-seeker"><div className="jd-path-icon"><UserRoundCheck size={23} /></div><p>For job seekers</p><h3>Take your next step with clarity.</h3><span>Explore opportunities, send applications, prepare for interviews, and never lose track of an important update.</span><Link to="/signup">Start your search <ArrowRight size={16} /></Link></article>
          <article className="jd-path-card jd-path-recruiter"><div className="jd-path-icon"><BriefcaseBusiness size={23} /></div><p>For recruiters</p><h3>Hire with less admin and more focus.</h3><span>Post roles, review applicants, schedule interviews, and move the right people through your pipeline.</span><Link to="/recruiter/post-job">Post a role <ArrowRight size={16} /></Link></article>
        </div>
      </section>

      <section className="jd-home-section jd-final-cta"><div><p className="jd-eyebrow"><Sparkles size={14} /> Your career deserves momentum</p><h2>Make the next move<br /><em>feel like progress.</em></h2><p>Set up your JobDekho workspace in a few moments. It&apos;s free to start and built around the way real hiring happens.</p></div><div className="jd-final-actions"><Link to="/signup" className="jd-solid-link">Create an account <ArrowRight size={16} /></Link><Link to="/jobs" className="jd-outline-link">Browse open roles</Link></div></section>
    </div>
  );
};

export default Home;
