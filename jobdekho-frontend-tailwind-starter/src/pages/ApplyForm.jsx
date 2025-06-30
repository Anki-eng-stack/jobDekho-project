import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ApplyForm = () => {
  const { jobId } = useParams();
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${jobId}`)
      .then(res => setJob(res.data))
      .catch(() => toast.error("Failed to load job info"));
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) return toast.error("Please upload your resume");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await axios.post(
        `http://localhost:5000/api/application/apply/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application submitted!");
      navigate("/applications");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Apply to {job?.title || "Job"}
      </h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Upload Resume (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full border p-2 mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
