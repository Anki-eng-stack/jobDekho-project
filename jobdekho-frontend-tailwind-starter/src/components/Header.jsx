import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timer;
    const loadUnread = async () => {
      if (!token) return;
      try {
        const res = await API.get("/chat/unread-count");
        setUnreadCount(res.data.unreadCount || 0);
      } catch {
        setUnreadCount(0);
      }
    };
    loadUnread();
    if (token) timer = setInterval(loadUnread, 30000);
    return () => timer && clearInterval(timer);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg group ${
      isActive
        ? "text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-200"
        : "text-slate-600 hover:text-violet-700 hover:bg-violet-50"
    }`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-header {
          font-family: 'DM Sans', sans-serif;
        }
        .jd-logo {
          font-family: 'Syne', sans-serif;
        }
        .jd-logo-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          margin-left: 2px;
          vertical-align: middle;
          margin-bottom: 4px;
        }
        .jd-nav-pill {
          position: relative;
          overflow: hidden;
        }
        .jd-nav-pill::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5);
          border-radius: 99px;
          transition: transform 0.2s ease;
        }
        .jd-nav-pill:hover::after {
          transform: translateX(-50%) scaleX(1);
        }
        .jd-btn-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.5rem 1.25rem;
          border-radius: 0.625rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
          letter-spacing: 0.01em;
        }
        .jd-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
        }
        .jd-btn-outline {
          background: transparent;
          color: #5b21b6;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.45rem 1.2rem;
          border-radius: 0.625rem;
          border: 1.5px solid #c4b5fd;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .jd-btn-outline:hover {
          background: #f5f3ff;
          border-color: #7c3aed;
        }
        .jd-btn-danger {
          background: transparent;
          color: #dc2626;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.45rem 1.2rem;
          border-radius: 0.625rem;
          border: 1.5px solid #fca5a5;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .jd-btn-danger:hover {
          background: #fff1f2;
          border-color: #dc2626;
        }
        .badge-pulse {
          animation: badgePulse 2s infinite;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .header-shadow {
          box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(124, 58, 237, 0.07);
        }
        .hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: #4b5563;
          border-radius: 99px;
          transition: all 0.25s ease;
        }
        .active-link-glow {
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
        }
      `}</style>

      <header
        className={`jd-header sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md header-shadow"
            : "bg-white/80 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink
              to="/"
              className="jd-logo flex items-center gap-1 text-2xl font-extrabold tracking-tight"
              style={{ color: "#1e1b4b", textDecoration: "none" }}
            >
              <span>Job</span>
              <span style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Dekho</span>
              <span className="jd-logo-dot"></span>
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/jobs" className={navClass}>
                <span className="jd-nav-pill">Jobs</span>
              </NavLink>

              {token && role === "jobseeker" && (
                <>
                  <NavLink to="/applications" className={navClass}>
                    Applications
                  </NavLink>
                  <NavLink to="/reviews" className={navClass}>
                    Reviews
                  </NavLink>
                </>
              )}

              {token && (role === "jobseeker" || role === "recruiter") && (
                <NavLink to="/chat" className={navClass}>
                  <span className="relative inline-flex items-center gap-1">
                    Chat
                    {unreadCount > 0 && (
                      <span
                        className="badge-pulse absolute -right-3 -top-2 flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white px-1"
                        style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </span>
                </NavLink>
              )}

              {token && (role === "jobseeker" || role === "recruiter") && (
                <NavLink to="/assistant" className={navClass}>
                  ✦ Assistant
                </NavLink>
              )}

              {token && role === "recruiter" && (
                <>
                  <NavLink to="/recruiter" end className={navClass}>
                    My Jobs
                  </NavLink>
                  <NavLink to="/recruiter/post-job" className={navClass}>
                    Post Job
                  </NavLink>
                </>
              )}

              {token && role === "admin" && (
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
              )}

              {/* Auth Buttons */}
              <div className="ml-3 flex items-center gap-2">
                {!token ? (
                  <>
                    <NavLink to="/login" style={{ textDecoration: "none" }}>
                      <button className="jd-btn-outline">Login</button>
                    </NavLink>
                    <NavLink to="/signup" style={{ textDecoration: "none" }}>
                      <button className="jd-btn-primary">Get Started →</button>
                    </NavLink>
                  </>
                ) : (
                  <button onClick={handleLogout} className="jd-btn-danger">
                    Logout
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="hamburger-line"
                style={menuOpen ? { transform: "translateY(7px) rotate(45deg)" } : {}}
              />
              <span
                className="hamburger-line"
                style={menuOpen ? { opacity: 0 } : {}}
              />
              <span
                className="hamburger-line"
                style={menuOpen ? { transform: "translateY(-7px) rotate(-45deg)" } : {}}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-slate-100">
              <div className="flex flex-col gap-1">
                <NavLink
                  to="/jobs"
                  className={navClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Jobs
                </NavLink>

                {token && role === "jobseeker" && (
                  <>
                    <NavLink to="/applications" className={navClass} onClick={() => setMenuOpen(false)}>
                      Applications
                    </NavLink>
                    <NavLink to="/reviews" className={navClass} onClick={() => setMenuOpen(false)}>
                      Reviews
                    </NavLink>
                  </>
                )}

                {token && (role === "jobseeker" || role === "recruiter") && (
                  <NavLink to="/chat" className={navClass} onClick={() => setMenuOpen(false)}>
                    <span className="relative inline-flex items-center gap-2">
                      Chat
                      {unreadCount > 0 && (
                        <span className="badge-pulse flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white px-1"
                          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                )}

                {token && (role === "jobseeker" || role === "recruiter") && (
                  <NavLink to="/assistant" className={navClass} onClick={() => setMenuOpen(false)}>
                    ✦ Assistant
                  </NavLink>
                )}

                {token && role === "recruiter" && (
                  <>
                    <NavLink to="/recruiter" end className={navClass} onClick={() => setMenuOpen(false)}>
                      My Jobs
                    </NavLink>
                    <NavLink to="/recruiter/post-job" className={navClass} onClick={() => setMenuOpen(false)}>
                      Post Job
                    </NavLink>
                  </>
                )}

                {token && role === "admin" && (
                  <NavLink to="/admin" className={navClass} onClick={() => setMenuOpen(false)}>
                    Admin
                  </NavLink>
                )}

                <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                  {!token ? (
                    <>
                      <NavLink to="/login" style={{ textDecoration: "none", flex: 1 }} onClick={() => setMenuOpen(false)}>
                        <button className="jd-btn-outline w-full">Login</button>
                      </NavLink>
                      <NavLink to="/signup" style={{ textDecoration: "none", flex: 1 }} onClick={() => setMenuOpen(false)}>
                        <button className="jd-btn-primary w-full">Get Started</button>
                      </NavLink>
                    </>
                  ) : (
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="jd-btn-danger w-full">
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
