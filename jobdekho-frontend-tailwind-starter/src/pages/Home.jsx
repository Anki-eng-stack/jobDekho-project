import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

const Home = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-home {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          position: relative;
          overflow: hidden;
        }

        /* Background blobs */
        .jd-home-blob1 {
          position: absolute; top: -80px; right: -80px;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.25), transparent 70%);
          pointer-events: none;
        }
        .jd-home-blob2 {
          position: absolute; bottom: -100px; left: -80px;
          width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%);
          pointer-events: none;
        }
        .jd-home-blob3 {
          position: absolute; top: 40%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 300px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(196,181,253,0.12), transparent 70%);
          pointer-events: none;
        }

        .jd-home-card {
          position: relative; z-index: 1;
          background: white;
          border-radius: 28px;
          border: 1.5px solid #ede9fe;
          width: 100%; max-width: 680px;
          box-shadow: 0 20px 60px rgba(124,58,237,0.13);
          overflow: hidden;
        }

        /* Gradient header strip */
        .jd-home-header {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          padding: 2rem 2.5rem 2.5rem;
          position: relative; overflow: hidden;
          text-align: center;
        }
        .jd-home-header::before {
          content: ''; position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .jd-home-header::after {
          content: ''; position: absolute;
          bottom: -50px; left: -40px;
          width: 150px; height: 150px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .jd-home-logo-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 64px; height: 64px; border-radius: 18px;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.28);
          margin: 0 auto 1.25rem;
          position: relative; z-index: 1;
          animation: jdFloat 3.5s ease-in-out infinite;
        }

        .jd-home-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.28);
          color: #ede9fe;
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.3rem 0.9rem; border-radius: 999px;
          margin-bottom: 1rem;
          position: relative; z-index: 1;
        }

        .jd-home-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900;
          color: white;
          line-height: 1.2;
          margin: 0 0 0.75rem;
          position: relative; z-index: 1;
        }
        .jd-home-title span {
          background: linear-gradient(135deg, #fde68a, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .jd-home-subtitle {
          font-size: 0.95rem; color: #c4b5fd;
          line-height: 1.65; max-width: 480px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* Body */
        .jd-home-body { padding: 2rem 2.5rem 2.5rem; }

        /* Feature pills */
        .jd-home-features {
          display: flex; flex-wrap: wrap; gap: 0.625rem;
          justify-content: center; margin-bottom: 2rem;
        }
        .jd-home-feat {
          display: inline-flex; align-items: center; gap: 6px;
          background: #faf9ff; border: 1.5px solid #ede9fe;
          color: #5b21b6; font-size: 0.8rem; font-weight: 600;
          padding: 0.4rem 0.875rem; border-radius: 999px;
          transition: all 0.2s;
        }
        .jd-home-feat:hover { background: #f5f3ff; border-color: #c4b5fd; transform: translateY(-1px); }

        /* Divider */
        .jd-home-divider {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: #7c3aed;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 1.5rem;
        }
        .jd-home-divider::before,
        .jd-home-divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #ede9fe); }
        .jd-home-divider::before { background: linear-gradient(90deg, transparent, #ede9fe); }
        .jd-home-divider::after  { background: linear-gradient(90deg, #ede9fe, transparent); }

        /* CTA Buttons */
        .jd-home-ctas { display: flex; gap: 0.875rem; flex-wrap: wrap; }

        .jd-home-btn-primary {
          font-family: 'Syne', sans-serif;
          flex: 1; min-width: 160px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white; font-size: 0.95rem; font-weight: 700;
          padding: 0.875rem 1.5rem; border-radius: 12px;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(124,58,237,0.32);
        }
        .jd-home-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(124,58,237,0.44); }

        .jd-home-btn-secondary {
          font-family: 'Syne', sans-serif;
          flex: 1; min-width: 160px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: white; color: #7c3aed;
          font-size: 0.95rem; font-weight: 700;
          padding: 0.875rem 1.5rem; border-radius: 12px;
          text-decoration: none; transition: all 0.2s;
          border: 1.5px solid #c4b5fd;
        }
        .jd-home-btn-secondary:hover { background: #f5f3ff; border-color: #7c3aed; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(124,58,237,0.12); }

        /* Stats row */
        .jd-home-stats {
          display: flex; gap: 0; margin-top: 2rem;
          background: #faf9ff; border: 1.5px solid #ede9fe;
          border-radius: 14px; overflow: hidden;
        }
        .jd-home-stat {
          flex: 1; padding: 1rem 0.5rem; text-align: center;
          border-right: 1.5px solid #ede9fe;
        }
        .jd-home-stat:last-child { border-right: none; }
        .jd-home-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem; font-weight: 800; color: #7c3aed;
        }
        .jd-home-stat-label {
          font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin-top: 2px;
        }

        @keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div className="jd-home">
        <div className="jd-home-blob1" />
        <div className="jd-home-blob2" />
        <div className="jd-home-blob3" />

        <div className="jd-home-card">

          {/* Header */}
          <div className="jd-home-header">
            <div className="jd-home-logo-wrap">
              <BriefcaseBusiness size={30} color="white" />
            </div>
            <div className="jd-home-chip">
              <Sparkles size={11} /> Career Platform
            </div>
            <h1 className="jd-home-title">
              Find Better Jobs Faster<br />with <span>JobDekho</span>
            </h1>
            <p className="jd-home-subtitle">
              Discover verified opportunities, apply smoothly, track every step, and manage your career — all in one place.
            </p>
          </div>

          {/* Body */}
          <div className="jd-home-body">

            {/* Feature pills */}
            <div className="jd-home-features">
              {[
                { icon: "✅", text: "Verified Listings" },
                { icon: "⚡", text: "1-Click Apply" },
                { icon: "📊", text: "Track Applications" },
                { icon: "🔔", text: "Job Alerts" },
              ].map(f => (
                <span key={f.text} className="jd-home-feat">{f.icon} {f.text}</span>
              ))}
            </div>

            <div className="jd-home-divider">Get Started</div>

            {/* CTA Buttons */}
            <div className="jd-home-ctas">
              <Link to="/jobs" className="jd-home-btn-primary">
                <BriefcaseBusiness size={17} /> Browse Jobs <ArrowRight size={15} />
              </Link>
              <Link to="/signup" className="jd-home-btn-secondary">
                <CheckCircle size={17} /> Create Account
              </Link>
            </div>

            {/* Stats */}
            <div className="jd-home-stats">
              {[
                { num: "10K+", label: "Jobs Posted" },
                { num: "5K+", label: "Companies" },
                { num: "50K+", label: "Job Seekers" },
              ].map(s => (
                <div key={s.label} className="jd-home-stat">
                  <div className="jd-home-stat-num">{s.num}</div>
                  <div className="jd-home-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;