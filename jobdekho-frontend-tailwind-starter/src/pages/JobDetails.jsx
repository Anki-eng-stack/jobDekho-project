import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness, // For Job Title
  Building2, // For Company
  MapPin, // For Location
  IndianRupee, // For Salary
  Tag, // For Job Type
  Sparkles, // For Skills
  AlignLeft, // For Description
  Send, // For Apply Now button
  Loader2, // For loading spinner
  AlertCircle, // For job not found
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        toast.error("Job not found or an error occurred.");
        setJob(null); // Explicitly set to null if not found
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
        <p className="ml-4 text-xl font-medium text-gray-700">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto border border-gray-200">
          <AlertCircle className="w-16 h-16 text-red-400 mb-6 animate-pulse-slow" />
          <p className="text-xl font-medium text-gray-700 mb-2">Job Not Found!</p>
          <p className="text-md text-gray-500 text-center">
            The job you are looking for might not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        {/* Job Image */}
        {job.jobImage?.url ? (
          <img
            src={job.jobImage.url}
            alt={job.title || "Job Image"}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/E0E7FF/6366F1?text=Job+Details"; }} // Fallback
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg mb-6 text-gray-400 text-lg">
            No Job Image Available
          </div>
        )}

        {/* Job Title */}
        <h2 className="text-4xl font-extrabold text-blue-800 mb-5 flex items-center">
          <BriefcaseBusiness className="inline-block w-10 h-10 mr-4 text-indigo-600" />
          {job.title}
        </h2>

        {/* Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-lg text-gray-700">
          <p className="flex items-center">
            <Building2 className="w-5 h-5 mr-3 text-gray-500" />
            <strong className="font-semibold text-gray-800">Company:</strong>{" "}
            {job.company || "N/A"}
          </p>
          <p className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-gray-500" />
            <strong className="font-semibold text-gray-800">Location:</strong>{" "}
            {job.location || "N/A"}
          </p>
          <p className="flex items-center">
            <IndianRupee className="w-5 h-5 mr-3 text-green-600" />
            <strong className="font-semibold text-gray-800">Salary:</strong>{" "}
            ₹{job.salary ? job.salary.toLocaleString('en-IN') : "Not mentioned"}
          </p>
          <p className="flex items-center">
            <Tag className="w-5 h-5 mr-3 text-purple-600" />
            <strong className="font-semibold text-gray-800">Type:</strong>{" "}
            {job.jobType || "N/A"}
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-7 h-7 mr-3 text-yellow-500" />
            Required Skills
          </h3>
          {Array.isArray(job.skills) && job.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No specific skills listed.</p>
          )}
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <AlignLeft className="w-7 h-7 mr-3 text-pink-500" />
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-base">
            {job.description || "No description provided."}
          </p>
        </div>

        {/* Apply Now Button */}
        <button
          onClick={() => navigate(`/apply/${job._id}`)}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex justify-center items-center font-semibold text-lg"
        >
          <Send size={20} className="mr-3" /> Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetails;