// src/pages/AllJobs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">All Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{job.company} - {job.location}</p>
            <p className="text-gray-700 text-sm mb-3">{job.description.slice(0, 100)}...</p>
            <p className="text-sm text-gray-600">Salary: {job.salary || 'N/A'}</p>
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllJobs;
