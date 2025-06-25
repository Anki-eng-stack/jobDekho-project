import React, { useEffect, useState } from "react";
import API from "../services/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data.applications);
      } catch (err) {
        console.error("Failed to load applications", err);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
              <p className="text-sm text-gray-600">Status: {app.status}</p>
              <p className="text-sm text-gray-500">
                Applied on: {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applications;
