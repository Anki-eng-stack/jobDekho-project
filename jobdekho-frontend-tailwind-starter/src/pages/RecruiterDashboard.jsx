import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await API.get("/recruiter/jobs");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Failed to fetch recruiter jobs", err);
      }
    };
    fetchMyJobs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Posted Jobs</h2>
      <Link
        to="/recruiter/post-job"
        className="mb-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Post New Job
      </Link>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">
                Applicants: {job.applicants?.length || 0}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterDashboard;
