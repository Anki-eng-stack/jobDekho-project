import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bot, BriefcaseBusiness, ClipboardList, LayoutDashboard, LogIn, Menu, MessageCircle, Plus, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import API from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    const loadUnread = async () => {
      try {
        const { data } = await API.get("/chat/unread-count");
        setUnreadCount(data.unreadCount || 0);
      } catch { setUnreadCount(0); }
    };
    loadUnread();
    const interval = window.setInterval(loadUnread, 30000);
    return () => window.clearInterval(interval);
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);
  const linkClass = ({ isActive }) => `jd-nav-link ${isActive ? "jd-nav-link-active" : ""}`;
  const items = [
    { to: "/jobs", label: "Explore jobs", icon: Search, show: true },
    { to: "/applications", label: "Applications", icon: ClipboardList, show: role === "jobseeker" },
    { to: "/chat", label: "Messages", icon: MessageCircle, show: role === "jobseeker" || role === "recruiter", badge: unreadCount },
    { to: "/assistant", label: "Career AI", icon: Bot, show: role === "jobseeker" || role === "recruiter" },
    { to: "/recruiter", label: "Recruiter hub", icon: LayoutDashboard, show: role === "recruiter" },
    { to: "/admin", label: "Admin", icon: ShieldCheck, show: role === "admin" },
  ].filter((item) => item.show);

  return (
    <header className={`jd-site-header ${scrolled ? "jd-site-header-scrolled" : ""}`}>
      <div className="jd-site-header-inner">
        <NavLink to="/" className="jd-brand" onClick={closeMenu} aria-label="JobDekho home">
          <span className="jd-brand-mark"><BriefcaseBusiness size={18} strokeWidth={2.4} /></span>
          <span>Job<span>Dekho</span></span><i />
        </NavLink>

        <nav className={`jd-nav ${menuOpen ? "jd-nav-open" : ""}`} aria-label="Main navigation">
          <div className="jd-nav-items">
            {items.map(({ to, label, icon: Icon, badge }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={closeMenu}>
                <Icon size={16} /><span>{label}</span>
                {badge > 0 && <b className="jd-unread-badge">{badge > 99 ? "99+" : badge}</b>}
              </NavLink>
            ))}
          </div>
          <div className="jd-nav-actions">
            {!token ? <>
              <NavLink to="/login" className="jd-login-link" onClick={closeMenu}><LogIn size={16} /> Sign in</NavLink>
              <NavLink to="/signup" className="jd-header-cta" onClick={closeMenu}><UserPlus size={16} /> Create account</NavLink>
            </> : <>
              {role === "recruiter" && <NavLink to="/recruiter/post-job" className="jd-header-cta" onClick={closeMenu}><Plus size={16} /> Post a job</NavLink>}
              <button type="button" className="jd-logout-link" onClick={logout}>Log out</button>
            </>}
          </div>
        </nav>

        <button className="jd-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={21} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
