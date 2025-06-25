import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [data, setData] = useState({ users: [], jobs: [], applications: [] });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <ul className="grid grid-cols-2 gap-2">
          {data.users.map((u) => (
            <li key={u._id} className="p-2 border rounded">
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Jobs</h3>
        <ul className="grid grid-cols-2 gap-2">
          {data.jobs.map((j) => (
            <li key={j._id} className="p-2 border rounded">
              {j.title} - {j.company}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Applications</h3>
        <ul className="grid grid-cols-2 gap-2">
          {data.applications.map((a) => (
            <li key={a._id} className="p-2 border rounded">
              {a.jobTitle} - Status: {a.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
