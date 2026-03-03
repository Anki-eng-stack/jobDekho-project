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
      } catch (err) {
        setUnreadCount(0);
      }
    };

    loadUnread();
    if (token) {
      timer = setInterval(loadUnread, 10000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const baseLinkClass = "px-3 py-1 rounded";
  const activeLinkClass = "bg-blue-100 text-blue-800";
  const inactiveLinkClass = "text-blue-600 hover:bg-blue-50";

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <NavLink to="/" className="text-2xl font-bold text-blue-600">
        JobDekho
      </NavLink>

      <nav className="flex items-center space-x-4">
        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
          }
        >
          Jobs
        </NavLink>

        {token && role === "jobseeker" && (
          <>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Applications
            </NavLink>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Reviews
            </NavLink>
          </>
        )}

        {token && (role === "jobseeker" || role === "recruiter") && (
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass} relative`
            }
          >
            Chat
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </NavLink>
        )}

        {token && (role === "jobseeker" || role === "recruiter") && (
          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            Assistant
          </NavLink>
        )}

        {token && role === "recruiter" && (
          <>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Reviews
            </NavLink>
            <NavLink
              to="/recruiter"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              My Jobs
            </NavLink>
            <NavLink
              to="/recruiter/post-job"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Post Job
            </NavLink>
          </>
        )}

        {token && role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            Admin
          </NavLink>
        )}

        <div className="ml-4 flex items-center space-x-2">
          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                Signup
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
