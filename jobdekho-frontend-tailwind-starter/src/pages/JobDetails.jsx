// src/pages/JobDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (!job) return <p className="text-center text-red-500">Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">{job.title}</h2>
      <p className="text-gray-700 mb-2"><strong>Company:</strong> {job.company}</p>
      <p className="text-gray-700 mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="text-gray-700 mb-2"><strong>Salary:</strong> ₹{job.salary || "Not mentioned"}</p>
      <p className="text-gray-700 mb-4"><strong>Job Type:</strong> {job.jobType}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Skills Required:</h3>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        {job.skills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4 mb-2">Description:</h3>
      <p className="text-gray-800">{job.description}</p>

      <button
        onClick={() => alert("Resume upload feature coming next")}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobDetails;
