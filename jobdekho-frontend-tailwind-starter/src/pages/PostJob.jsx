// src/pages/PostJob.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    company: "",
    salary: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // This calls POST http://localhost:5000/api/jobs
      await API.post("/jobs", formData);
      toast.success("Job posted successfully!");
      navigate("/recruiter"); // back to recruiter dashboard
    } catch (err) {
      console.error("Error creating job:", err.response || err);
      toast.error(
        err.response?.data?.error ||
          "Failed to post job. Make sure all fields are filled."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full p-2 border rounded h-32"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? <Spinner /> : "Submit Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
