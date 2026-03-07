import React, { useEffect, useState } from "react";
import API from "../services/api";

const statusColors = {
  pending:  { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  accepted: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  rejected: { bg: "#fff1f2", color: "#dc2626", border: "#fecaca" },
  default:  { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
};

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    background: "#fff",
    border: "1.5px solid #ede9fe",
    borderRadius: "16px",
    padding: "1.25rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 4px 16px rgba(124,58,237,0.07)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,0.13)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.07)"; }}
  >
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: color || "linear-gradient(135deg,#7c3aed,#4f46e5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "1.4rem", flexShrink: 0,
    }}>{icon}</div>
    <div>
      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#1e1b4b", margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
    </div>
  </div>
);

const SectionHeader = ({ icon, title, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
    <div style={{
      width: 32, height: 32, borderRadius: 9,
      background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.9rem",
    }}>{icon}</div>
    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{title}</h3>
    <span style={{
      marginLeft: "auto", fontSize: "0.72rem", fontWeight: 700,
      background: "#f5f3ff", color: "#7c3aed", border: "1.5px solid #ddd6fe",
      borderRadius: 99, padding: "2px 10px",
    }}>{count} total</span>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState({ users: [], jobs: [], applications: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .jd-admin { font-family: 'DM Sans', sans-serif; }

        .jd-admin-section {
          background: #fff;
          border: 1.5px solid #ede9fe;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(124,58,237,0.06);
        }

        .jd-admin-row {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #f3f0ff;
          background: #faf9ff;
          transition: all 0.2s;
        }

        .jd-admin-row:hover {
          border-color: #c4b5fd;
          background: #f5f3ff;
        }

        .jd-admin-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg,#7c3aed,#4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne',sans-serif;
          font-weight: 800; font-size: 0.9rem;
          color: white; flex-shrink: 0;
        }

        .jd-admin-name {
          font-weight: 600; font-size: 0.875rem; color: #1e1b4b; margin: 0;
        }

        .jd-admin-sub {
          font-size: 0.775rem; color: #94a3b8; margin: 0;
        }

        .jd-status-badge {
          margin-left: auto;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1.5px solid;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .jd-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #1e1b4b;
          margin: 0;
        }

        .jd-page-sub {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 4px 0 0;
        }

        .jd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 640px) { .jd-grid-2 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="jd-admin" style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem", boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
          }}>🛡️</div>
          <div>
            <h2 className="jd-page-title">Admin Dashboard</h2>
            <p className="jd-page-sub">Manage users, jobs, and applications</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Total Users"        value={data.users.length}        icon="👥" color="linear-gradient(135deg,#7c3aed,#4f46e5)" />
          <StatCard label="Total Jobs"         value={data.jobs.length}         icon="💼" color="linear-gradient(135deg,#0ea5e9,#6366f1)" />
          <StatCard label="Total Applications" value={data.applications.length} icon="📋" color="linear-gradient(135deg,#10b981,#059669)" />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#a78bfa" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #ede9fe", borderTopColor: "#7c3aed", animation: "jdSpin 0.7s linear infinite", margin: "0 auto 1rem" }} />
            Loading dashboard...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Users */}
            <div className="jd-admin-section">
              <SectionHeader icon="👥" title="Users" count={data.users.length} />
              <div className="jd-grid-2">
                {data.users.map((u) => (
                  <div key={u._id} className="jd-admin-row">
                    <div className="jd-admin-avatar">{u.name?.charAt(0).toUpperCase() || "U"}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="jd-admin-name">{u.name}</p>
                      <p className="jd-admin-sub">{u.email}</p>
                    </div>
                    <span className="jd-status-badge" style={{
                      background: u.role === "recruiter" ? "#f0fdf4" : "#f5f3ff",
                      color: u.role === "recruiter" ? "#15803d" : "#6d28d9",
                      borderColor: u.role === "recruiter" ? "#bbf7d0" : "#ddd6fe",
                    }}>{u.role || "jobseeker"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs */}
            <div className="jd-admin-section">
              <SectionHeader icon="💼" title="Jobs" count={data.jobs.length} />
              <div className="jd-grid-2">
                {data.jobs.map((j) => (
                  <div key={j._id} className="jd-admin-row">
                    <div className="jd-admin-avatar" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
                      {j.company?.charAt(0).toUpperCase() || "J"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="jd-admin-name">{j.title}</p>
                      <p className="jd-admin-sub">{j.company}</p>
                    </div>
                    {j.location && (
                      <span className="jd-status-badge" style={{ background: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }}>
                        📍 {j.location}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="jd-admin-section">
              <SectionHeader icon="📋" title="Applications" count={data.applications.length} />
              <div className="jd-grid-2">
                {data.applications.map((a) => {
                  const sc = statusColors[a.status?.toLowerCase()] || statusColors.default;
                  return (
                    <div key={a._id} className="jd-admin-row">
                      <div className="jd-admin-avatar" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>📄</div>
                      <div style={{ minWidth: 0 }}>
                        <p className="jd-admin-name">{a.jobTitle || "Untitled Job"}</p>
                        <p className="jd-admin-sub">{a.applicantName || "Applicant"}</p>
                      </div>
                      <span className="jd-status-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                        {a.status || "pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`@keyframes jdSpin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default AdminDashboard;