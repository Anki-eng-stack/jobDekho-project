import React, { useEffect, useState } from "react";
import API from "../services/api"; // Assuming this is your axios instance
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText,
  CalendarCheck,
  AlertCircle,
  Trash2,
  ExternalLink,
  BriefcaseBusiness, // Added for job icon
  Building2, // Added for company icon
} from "lucide-react";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Failed to load applications", err);
      toast.error("Failed to load applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancel = async (id) => {
    // Implement a confirmation dialog here instead of alert/confirm
    if (window.confirm("Are you sure you want to cancel this application? This action cannot be undone.")) {
      try {
        await API.delete(`/applications/cancel/${id}`);
        toast.success("Application cancelled successfully!");
        fetchApplications(); // Re-fetch to update the list
      } catch (err) {
        console.error("Failed to cancel application", err);
        toast.error(err.response?.data?.error || "Failed to cancel application.");
      }
    }
  };

  // Helper function for status styling
  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-200 text-gray-700 line-through";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-tight drop-shadow-sm">
          <FileText className="inline-block w-9 h-9 mr-3 text-indigo-600" /> My Job Applications
        </h2>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <AlertCircle className="w-16 h-16 text-indigo-400 mb-6 animate-bounce-slow" />
            <p className="text-xl font-medium text-gray-700 mb-2">No applications found!</p>
            <p className="text-md text-gray-500 text-center">It looks like you haven’t applied for any jobs yet. Start exploring opportunities!</p>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col justify-between transform hover:-translate-y-1"
              >
                {/* Job Image - Conditional Rendering */}
                {app.job?.jobImage?.url ? (
                  <img
                    src={app.job.jobImage.url}
                    alt={app.job.title || "Job Image"}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/E0E7FF/6366F1?text=No+Image"; }} // Placeholder on error
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4 text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}

                <div className="flex-1">
                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <BriefcaseBusiness className="inline w-6 h-6 mr-2 text-indigo-500" />
                    {app.job?.title || "Untitled Job"}
                  </h3>

                  {/* Company */}
                  <p className="text-md text-gray-700 mb-2 flex items-center">
                    <Building2 className="inline w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Company:</span>{" "}
                    {app.job?.company || "N/A"}
                  </p>

                  {/* Status */}
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Date Applied */}
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <CalendarCheck className="inline w-4 h-4 mr-2 text-gray-400" />
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </p>

                  {/* Resume Link */}
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      <ExternalLink size={16} className="mr-1" /> View Resume
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/jobs/${app.job?._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium"
                  >
                    <ExternalLink size={16} /> Job Details
                  </button>
                  {app.status !== "cancelled" && ( // Only show cancel if not already cancelled
                    <button
                      onClick={() => handleCancel(app._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium"
                    >
                      <Trash2 size={16} /> Cancel Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;