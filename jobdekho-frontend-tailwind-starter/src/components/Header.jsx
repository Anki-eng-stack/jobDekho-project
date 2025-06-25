// src/components/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Tailwind classes for active/inactive links
  const baseLinkClass = "px-3 py-1 rounded";
  const activeLinkClass = "bg-blue-100 text-blue-800";
  const inactiveLinkClass = "text-blue-600 hover:bg-blue-50";

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <NavLink
        to="/"
        className="text-2xl font-bold text-blue-600"
      >
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

        {token && (
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
              to="/interviews"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Interviews
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

        {token && role === "recruiter" && (
          <>
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
