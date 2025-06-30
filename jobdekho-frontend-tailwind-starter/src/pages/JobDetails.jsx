// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error("Job not found");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to apply");
      return;
    }

    setApplying(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/application/apply/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

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
        onClick={handleApply}
        disabled={applying}
        className={`mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition ${applying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {applying ? 'Applying...' : 'Apply Now'}
      </button>
    </div>
  );
};

export default JobDetails;
