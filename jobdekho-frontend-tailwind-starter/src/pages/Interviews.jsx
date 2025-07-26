import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify"; // For displaying notifications
import {
  CalendarDays, // Icon for overall interviews page
  BriefcaseBusiness, // Icon for job title
  CalendarCheck2, // Icon for date
  Video, // Icon for online mode
  MapPin, // Icon for offline mode
  Hourglass, // Icon for pending status
  CheckCircle, // Icon for completed status
  XCircle, // Icon for cancelled status
  AlertCircle, // Icon for no interviews
  UserRound, // Icon for recruiter
  NotebookPen, // Icon for notes
} from "lucide-react"; // Make sure to install lucide-react if you haven't: npm install lucide-react

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interviews/my"); // This endpoint now populates 'jobTitle' and 'recruiter'
        setInterviews(res.data.interviews);
        toast.success("Interviews loaded successfully!");
      } catch (err) {
        console.error("Failed to load interviews", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Failed to load interviews. Please try again.");
      } finally {
        setLoading(false); // End loading regardless of success/failure
      }
    };
    fetchInterviews();
  }, []);

  // Helper function for status styling and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) { // Added optional chaining for safety
      case "scheduled":
        return { text: "Scheduled", class: "bg-blue-100 text-blue-800", icon: <CalendarCheck2 size={16} /> };
      case "completed":
        return { text: "Completed", class: "bg-green-100 text-green-800", icon: <CheckCircle size={16} /> };
      case "cancelled":
        return { text: "Cancelled", class: "bg-red-100 text-red-800", icon: <XCircle size={16} /> };
      case "pending": // If you decide to use a 'pending' status for interviews (e.g., initial state)
        return { text: "Pending", class: "bg-yellow-100 text-yellow-800", icon: <Hourglass size={16} /> };
      default:
        return { text: status || "Unknown", class: "bg-gray-100 text-gray-700", icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <CalendarDays className="inline-block w-10 h-10 mr-3 text-indigo-600" /> My Interviews
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            {/* Simple Tailwind CSS spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <AlertCircle className="w-16 h-16 text-indigo-400 mb-6 animate-bounce-slow" />
            <p className="text-xl font-medium text-gray-700 mb-2">No interviews scheduled yet!</p>
            <p className="text-md text-gray-500 text-center">Keep applying for jobs, and interviews will appear here.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviews.map((iv) => {
              const statusInfo = getStatusInfo(iv.status);
              const interviewDate = new Date(iv.date);
              const formattedDate = interviewDate.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const formattedTime = interviewDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // Use 12-hour format with AM/PM
              });

              return (
                <li
                  key={iv._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <BriefcaseBusiness className="w-6 h-6 mr-2 text-indigo-500" />
                    {iv.jobTitle || "Untitled Job Interview"}
                  </h3>

                  {/* Display Recruiter Info */}
                  {iv.recruiter && iv.recruiter.name && (
                    <p className="text-md text-gray-700 mb-2 flex items-center">
                      <UserRound className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="font-semibold">Recruiter:</span> {iv.recruiter.name}
                    </p>
                  )}
                  {/* Optionally display recruiter email:
                  {iv.recruiter && iv.recruiter.email && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {iv.recruiter.email}
                    </p>
                  )}
                  */}

                  <p className="text-md text-gray-700 mb-2 flex items-center">
                    <CalendarCheck2 className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Date:</span> {formattedDate} at {formattedTime}
                  </p>

                  <p className="text-md text-gray-700 mb-2 flex items-center">
                    {iv.mode?.toLowerCase() === "online" ? ( // Use optional chaining and toLowerCase for robustness
                      <Video className="w-5 h-5 mr-2 text-purple-600" />
                    ) : (
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    )}
                    <span className="font-semibold">Mode:</span> {iv.mode}
                  </p>

                  <div className="mb-4 flex items-center">
                    <span className="font-semibold text-gray-700 text-md mr-2">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                      {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Display Notes with icon */}
                  {iv.notes && (
                    <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start">
                      <NotebookPen className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold flex-shrink-0 mr-1">Notes:</span> {iv.notes}
                    </p>
                  )}

                  {/* Corrected: Use iv.location for the link */}
                  {iv.location && iv.mode?.toLowerCase() === "online" && ( // Use optional chaining and toLowerCase
                    <a
                      href={iv.location} // ⭐ CHANGED FROM iv.interviewLink to iv.location ⭐
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 text-sm font-medium"
                    >
                      <Video size={16} className="mr-2" /> Join Interview
                    </a>
                  )}
                  {iv.location && iv.mode?.toLowerCase() === "offline" && ( // Added display for offline location
                    <p className="mt-4 text-sm text-gray-700 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center">
                        <MapPin size={16} className="mr-2 text-blue-600" />
                        <span className="font-semibold">Venue:</span> {iv.location}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Interviews;