import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [unreadCount, setUnreadCount] = useState(0);

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
    if (token) timer = setInterval(loadUnread, 10000);
    return () => timer && clearInterval(timer);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-brand-100 text-brand-700"
        : "text-slate-700 hover:bg-white/70 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/85 backdrop-blur">
      <div className="jd-container flex flex-wrap items-center justify-between gap-3 py-3">
        <NavLink to="/" className="text-xl font-extrabold tracking-tight text-brand-600">
          JobDekho
        </NavLink>

        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/jobs" className={navClass}>
            Jobs
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
              <span className="relative">
                Chat
                {unreadCount > 0 && (
                  <span className="absolute -right-4 -top-2 min-w-5 rounded-full bg-rose-600 px-1.5 text-center text-[10px] leading-5 text-white">
                    {unreadCount}
                  </span>
                )}
              </span>
            </NavLink>
          )}

          {token && (role === "jobseeker" || role === "recruiter") && (
            <NavLink to="/assistant" className={navClass}>
              Assistant
            </NavLink>
          )}

          {token && role === "recruiter" && (
            <>
              <NavLink to="/recruiter" className={navClass}>
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

          <div className="ml-1 flex items-center gap-2">
            {!token ? (
              <>
                <NavLink to="/login" className="jd-btn-secondary px-3 py-2">
                  Login
                </NavLink>
                <NavLink to="/signup" className="jd-btn px-3 py-2">
                  Signup
                </NavLink>
              </>
            ) : (
              <button onClick={handleLogout} className="jd-btn-secondary border-rose-200 text-rose-700">
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
