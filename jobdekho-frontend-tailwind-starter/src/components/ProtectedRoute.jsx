// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const [show, setShow] = useState(false);

  // Small delay so the redirect screen is visible briefly
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, []);

  const allowedRoles = roles || role;
  const allowed = allowedRoles
    ? Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    : null;

  const isAllowed = token && (!allowed || allowed.includes(userRole));
  const redirectTo = !token ? "/login" : "/";

  if (isAllowed) return children;

  if (!show) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

          .jd-redirect-overlay {
            font-family: 'DM Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%);
            gap: 1.5rem;
          }

          .jd-redirect-logo {
            font-family: 'Syne', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.02em;
          }

          .jd-redirect-logo span {
            background: linear-gradient(135deg, #7c3aed, #4f46e5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .jd-redirect-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #ede9fe;
            border-top-color: #7c3aed;
            border-radius: 50%;
            animation: jdSpin 0.7s linear infinite;
          }

          @keyframes jdSpin {
            to { transform: rotate(360deg); }
          }

          .jd-redirect-text {
            font-size: 0.9rem;
            color: #7c3aed;
            font-weight: 500;
            letter-spacing: 0.03em;
            animation: jdFade 1s ease infinite alternate;
          }

          @keyframes jdFade {
            from { opacity: 0.5; }
            to { opacity: 1; }
          }

          .jd-redirect-card {
            background: white;
            border-radius: 20px;
            padding: 2.5rem 3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.25rem;
            box-shadow: 0 8px 40px rgba(124, 58, 237, 0.12), 0 2px 8px rgba(124,58,237,0.06);
            border: 1.5px solid #ede9fe;
          }
        `}</style>

        <div className="jd-redirect-overlay">
          <div className="jd-redirect-card">
            <div className="jd-redirect-logo">
              Job<span>Dekho</span>
              <span style={{
                display: "inline-block",
                width: "8px", height: "8px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                marginLeft: "3px",
                verticalAlign: "middle",
                marginBottom: "5px"
              }} />
            </div>
            <div className="jd-redirect-spinner" />
            <p className="jd-redirect-text">
              {!token ? "Redirecting to login..." : "Access denied. Redirecting..."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;