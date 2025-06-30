// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch {
        toast.error("Job not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!job) return <p className="text-center">Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> ₹{job.salary || "Not mentioned"}</p>
      <p><strong>Type:</strong> {job.jobType}</p>

      <h3 className="mt-4 font-semibold">Skills:</h3>
      <ul className="list-disc list-inside mb-4">
        {Array.isArray(job.skills) ? job.skills.map((s,i) => <li key={i}>{s}</li>) : <li>—</li>}
      </ul>

      <h3 className="mt-4 font-semibold">Description:</h3>
      <p className="mb-6">{job.description}</p>

      <button
        onClick={() => navigate(`/apply/${job._id}`)}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobDetails;
