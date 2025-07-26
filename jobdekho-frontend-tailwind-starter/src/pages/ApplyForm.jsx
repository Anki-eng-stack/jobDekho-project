import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, UploadCloud } from "lucide-react"; // Added icons for visual appeal

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
  const [loading, setLoading] = useState(false); // Added loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const { name, email, marks, grade, experience, skills } = form;
    if (!name || !email || !resumeFile) {
      toast.error("Name, email, and resume are required fields.");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("marks", marks);
    formData.append("grade", grade);
    formData.append("experience", experience);
    formData.append("skills", skills);
    formData.append("resume", resumeFile);

    try {
      await axios.post(
        `http://localhost:5000/api/applications/apply/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      console.error("Submission error:", err.response || err);
      toast.error(err.response?.data?.error || "Application submission failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          <FileText className="inline-block w-8 h-8 mr-3 text-indigo-600" /> Apply for Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">Marks/Percentage (e.g., 85 or 8.5)</label>
              <input
                type="text"
                id="marks"
                name="marks"
                placeholder="e.g., 85 or 8.5"
                value={form.marks}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade (e.g., A, B+, First Class)</label>
              <input
                type="text"
                id="grade"
                name="grade"
                placeholder="e.g., A, B+, First Class"
                value={form.grade}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Experience and Skills */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              placeholder="e.g., 2"
              value={form.experience}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
            <textarea
              id="skills"
              name="skills"
              placeholder="e.g., JavaScript, React, Node.js, SQL"
              value={form.skills}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 resize-y"
            ></textarea>
          </div>

          {/* Resume Upload */}
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF) <span className="text-red-500">*</span></label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                  {resumeFile && (
                    <p className="mt-2 text-sm text-green-600">File selected: {resumeFile.name}</p>
                  )}
                </div>
                <input
                  id="resume"
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold text-lg mt-8"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;