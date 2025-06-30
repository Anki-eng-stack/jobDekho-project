// src/pages/ApplyForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ApplyForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    marks: "",
    grade: "",
    experience: "",
    skills: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, marks, grade, experience, skills } = form;
    if (!name || !email || !resumeFile) {
      return toast.error("Name, email and resume are required");
    }

    // build FormData explicitly
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("marks", marks);
    formData.append("grade", grade);
    formData.append("experience", experience);
    formData.append("skills", skills);
    formData.append("resume", resumeFile);

    // debug: log keys & values
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/application/apply/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: when uploading FormData, you do NOT need to set Content-Type manually
          },
        }
      );
      toast.success("Application submitted successfully");
      navigate("/applications");
    } catch (err) {
      console.error("Submission error:", err.response || err);
      toast.error(err.response?.data?.error || "Submission failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Job Application</h2>
      <form onSubmit={handleSubmit}>
        {["name", "email", "marks", "grade", "experience", "skills"].map(field => (
          <div key={field} className="mb-4">
            <label className="block font-medium text-gray-700 capitalize">
              {field}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required={field === "name" || field === "email"}
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block font-medium text-gray-700">Upload Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
