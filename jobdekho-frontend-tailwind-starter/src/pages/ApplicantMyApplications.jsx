import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, BriefcaseBusiness, CalendarDays, Video, MapPin, Loader2, Hourglass, CheckCircle, XCircle, ClipboardCheck, CalendarCheck2, NotebookPen
} from "lucide-react";

const ApplicantMyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/my-applications", // Endpoint to fetch applicant's applications
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // ⭐ DEBUG LOGS: Check what API returns ⭐
        console.log("ApplicantMyApplications - API Response Data:", res.data);
        
        setApplications(res.data.applications);
        
        // ⭐ DEBUG LOGS: Check state after setting ⭐
        console.log("ApplicantMyApplications - Applications state after update:", res.data.applications);

        toast.success("My applications loaded successfully!");
      } catch (err) {
        console.error("ApplicantMyApplications - Failed to fetch my applications:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load your applications.");
        toast.error(err.response?.data?.error || "Failed to load applications.");
        
        if (err.response?.status === 401 || err.response?.status === 403) {
            navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyApplications();
    } else {
      setLoading(false);
      setError("Please log in to view your applications.");
      toast.info("Please log in to view your applications.");
      navigate("/login");
    }
  }, [token, navigate]);

  // ⭐ DEBUG LOGS: Check state right before render ⭐
  console.log("ApplicantMyApplications - Current applications state in render:", applications);
  console.log("ApplicantMyApplications - Is loading:", loading);
  console.log("ApplicantMyApplications - Has error:", error);


  const getApplicationStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return { text: "Applied", class: "bg-blue-100 text-blue-800", icon: <Hourglass size={16} /> };
      case "reviewed":
        return { text: "Reviewed", class: "bg-purple-100 text-purple-800", icon: <ClipboardCheck size={16} /> };
      case "shortlisted":
        return { text: "Shortlisted", class: "bg-green-100 text-green-800", icon: <CheckCircle size={16} /> };
      case "rejected":
        return { text: "Rejected", class: "bg-red-100 text-red-800", icon: <XCircle size={16} /> };
      case "interview_scheduled":
        return { text: "Interview Scheduled", class: "bg-indigo-100 text-indigo-800", icon: <CalendarDays size={16} /> };
      case "hired":
        return { text: "Hired", class: "bg-teal-100 text-teal-800", icon: <CheckCircle size={16} /> };
      case "cancelled":
        return { text: "Cancelled", class: "bg-gray-200 text-gray-700", icon: <XCircle size={16} /> };
      default:
        return { text: status || "Unknown", class: "bg-gray-100 text-gray-700", icon: null };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
        <p className="ml-4 text-xl font-medium text-gray-700">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto border border-gray-200">
          <FileText className="w-16 h-16 text-red-400 mb-6" />
          <p className="text-xl font-medium text-gray-700 mb-2">Error Loading Applications</p>
          <p className="text-md text-gray-500 text-center">{error}</p>
          <Link
            to="/browse-jobs"
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <BriefcaseBusiness className="inline-block w-10 h-10 mr-3 text-indigo-600" /> My Job Applications
        </h2>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mb-6" />
            <p className="text-xl font-medium text-gray-700 mb-2 text-center">No applications found!</p>
            <p className="text-md text-gray-500 text-center mb-6">
              It looks like you haven't applied for any jobs yet. Start exploring opportunities!
            </p>
            <Link
              to="/browse-jobs"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((application) => {
              const appStatusInfo = getApplicationStatusInfo(application.status);
              return (
                <li
                  key={application._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <BriefcaseBusiness className="w-6 h-6 mr-3 text-purple-600" />
                    {application.job?.title || "Job Title N/A"}
                  </h3>
                  <p className="text-md text-gray-700 mb-1 flex items-center">
                    <span className="font-semibold mr-1">Company:</span> {application.job?.company || "N/A"}
                  </p>

                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center mb-2 mt-2 font-medium"
                    >
                      <FileText className="w-4 h-4 mr-2" /> View Resume
                    </a>
                  )}

                  <div className="mb-4 flex items-center">
                    <span className="font-semibold text-gray-700 text-md mr-2">Application Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${appStatusInfo.class}`}>
                      {appStatusInfo.icon && <span className="mr-1">{appStatusInfo.icon}</span>}
                      {appStatusInfo.text}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                    {application.interview ? (
                      <>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                          <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" /> Interview Scheduled
                        </h4>
                        <p className="text-sm text-gray-700 mb-1">
                          <CalendarCheck2 className="inline-block w-4 h-4 mr-1 text-gray-500" /> Date: {new Date(application.interview.date).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-700 mb-1 flex items-center">
                          {application.interview.mode === "online" ? (
                            <Video className="w-4 h-4 mr-2 text-purple-600" />
                          ) : (
                            <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          )}
                          Mode: {application.interview.mode}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <MapPin className="inline-block w-4 h-4 mr-1 text-gray-500" /> Location: {application.interview.location}
                        </p>
                        {application.interview.notes && (
                          <p className="text-sm text-gray-700 mb-2 flex items-start">
                            <NotebookPen className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                            Notes: {application.interview.notes}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">Interview not yet scheduled.</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApplicantMyApplications;