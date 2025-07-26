import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

// ⭐ FIX: Added CalendarCheck2 and NotebookPen to the import list ⭐
import {
  BriefcaseBusiness, // For job title
  UserRound, // For applicant name
  Mail, // For applicant email
  CheckCircle, // For application status (e.g., pending/approved)
  CalendarDays, // For interview date
  Video, // For online mode
  MapPin, // For offline mode
  Edit, // For edit interview
  PlusCircle, // For schedule interview
  Loader2, // For general loading
  FileText, // For Resume/CV
  Hourglass, // For pending application status
  XCircle, // For rejected application status
  ClipboardCheck, // For shortlisted application status
  CalendarCheck2, // ⭐ ADDED THIS ⭐
  NotebookPen,    // ⭐ ADDED THIS ⭐
} from "lucide-react";

const JobApplicantsList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("Job Applicants"); // Default title
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        // This endpoint should return applications for a specific job,
        // populated with user (applicant) and interview details.
        const res = await axios.get(
          `http://localhost:5000/api/applications/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplicants(res.data.applications);

        // Set job title from the first application or directly fetch if no applicants
        if (res.data.applications.length > 0 && res.data.applications[0].job?.title) {
          setJobTitle(res.data.applications[0].job.title);
        } else {
          // If no applicants, or job title not populated on application, fetch job details directly
          const jobRes = await axios.get(
            `http://localhost:5000/api/jobs/${jobId}`, // Assuming you have a get job by ID endpoint
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setJobTitle(jobRes.data.title); // Assuming jobRes.data contains the job object directly
        }

        toast.success(`Loaded applicants for job.`);
      } catch (err) {
        console.error("Failed to fetch applicants:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load applicants. Please check your permissions or if the job exists.");
        toast.error(err.response?.data?.error || "Failed to load applicants.");
        // Optionally redirect if job not found or unauthorized
        // navigate("/recruiter/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId, token, navigate]);

  // Helper function for application status styling and icon
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
      default:
        return { text: status || "Unknown", class: "bg-gray-100 text-gray-700", icon: null };
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
        <p className="ml-4 text-xl font-medium text-gray-700">Loading applicants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto border border-gray-200">
          <FileText className="w-16 h-16 text-red-400 mb-6" />
          <p className="text-xl font-medium text-gray-700 mb-2">Error Loading Applicants</p>
          <p className="text-md text-gray-500 text-center">{error}</p>
          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <BriefcaseBusiness className="inline-block w-10 h-10 mr-3 text-indigo-600" /> Applicants for "{jobTitle}"
        </h2>

        {applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <UserRound className="w-16 h-16 text-gray-400 mb-6" />
            <p className="text-xl font-medium text-gray-700 mb-2 text-center">No applicants for this job yet.</p>
            <p className="text-md text-gray-500 text-center mb-6">
              Share your job posting to attract more candidates!
            </p>
            <Link
              to="/recruiter/dashboard"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applicants.map((application) => {
              const appStatusInfo = getApplicationStatusInfo(application.status);
              return (
                <li
                  key={application._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <UserRound className="w-6 h-6 mr-3 text-purple-600" />
                    {application.user?.name || "N/A"}
                  </h3>
                  <p className="text-md text-gray-700 mb-1 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    {application.user?.email || "N/A"}
                  </p>
                  {/* Display other application form fields */}
                  {application.marks && <p className="text-sm text-gray-600">Marks: {application.marks}</p>}
                  {application.grade && <p className="text-sm text-gray-600">Grade: {application.grade}</p>}
                  {application.experience && <p className="text-sm text-gray-600">Experience: {application.experience}</p>}
                  {application.skills && application.skills.length > 0 && (
                    <p className="text-sm text-gray-600">Skills: {application.skills.join(', ')}</p>
                  )}


                  {/* Link to applicant's resume */}
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

                  {/* Application Status */}
                  <div className="mb-4 flex items-center">
                    <span className="font-semibold text-gray-700 text-md mr-2">Application Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${appStatusInfo.class}`}>
                      {appStatusInfo.icon && <span className="mr-1">{appStatusInfo.icon}</span>}
                      {appStatusInfo.text}
                    </span>
                  </div>


                  {/* Interview Details & Actions */}
                  <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                    {application.interview ? (
                      <>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                          <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" /> Interview Scheduled
                        </h4>
                        <p className="text-sm text-gray-700 mb-1">
                          {/* ⭐ Using CalendarCheck2 here ⭐ */}
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
                            {/* ⭐ Using NotebookPen here ⭐ */}
                            <NotebookPen className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                            Notes: {application.interview.notes}
                          </p>
                        )}
                        <Link
                          to={`/recruiter/interviews/${application.interview._id}/edit`} // Route for editing an existing interview
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center text-sm font-medium mt-3"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit Interview
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/recruiter/interviews/schedule/${application._id}`} // Route for scheduling a new interview for this application
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-all duration-300 flex items-center justify-center text-sm font-medium mt-3"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" /> Schedule Interview
                      </Link>
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

export default JobApplicantsList;