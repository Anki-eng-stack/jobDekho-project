// src/pages/AllJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        🔍 All Available Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col"
            >
              {job.jobImage?.url && (
                <img
                  src={job.jobImage.url}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <h2 className="text-xl font-semibold text-blue-700 mb-1">
                {job.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                🏢 {job.company} — 📍 {job.location}
              </p>
              <p className="text-gray-700 text-sm mb-3">
                {job.description.slice(0, 100)}...
              </p>
              <p className="text-sm text-gray-600 mb-4">
                💰 Salary: ₹{job.salary || "Not mentioned"}
              </p>

              <button
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
