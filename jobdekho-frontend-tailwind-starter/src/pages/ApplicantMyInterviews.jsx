import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { CalendarDays, BriefcaseBusiness, UserRound, MapPin, Video, Loader2 } from "lucide-react";

const ApplicantMyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Get applicant's token

  useEffect(() => {
    const fetchMyInterviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/interviews/my-interviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInterviews(res.data);
      } catch (err) {
        console.error("Failed to fetch interviews:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load your interviews.");
        toast.error(err.response?.data?.error || "Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyInterviews();
    } else {
      setError("Please log in to view your interviews.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
        <p className="ml-4 text-xl font-medium text-gray-700">Loading your interviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto border border-gray-200">
          <CalendarDays className="w-16 h-16 text-red-400 mb-6" />
          <p className="text-xl font-medium text-gray-700 mb-2">Error Loading Interviews</p>
          <p className="text-md text-gray-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <CalendarDays className="inline-block w-10 h-10 mr-3 text-indigo-600" /> My Scheduled Interviews
        </h2>

        {interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <CalendarDays className="w-16 h-16 text-gray-400 mb-6" />
            <p className="text-xl font-medium text-gray-700 mb-2 text-center">No interviews scheduled yet.</p>
            <p className="text-md text-gray-500 text-center mb-6">
              Keep an eye on your applications! Recruiters might schedule an interview soon.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {interviews.map((interview) => (
              <li
                key={interview._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BriefcaseBusiness className="w-7 h-7 mr-3 text-purple-600" />
                  {interview.job?.title || "N/A Job Title"}
                </h3>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
                  Date & Time: {new Date(interview.date).toLocaleString()}
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                  {interview.mode === "online" ? (
                    <Video className="w-5 h-5 mr-2 text-purple-600" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  )}
                  Mode: {interview.mode}
                </p>
                <p className="text-md text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  Location: {interview.location}
                </p>
                {interview.notes && (
                  <p className="text-sm text-gray-700 mb-2 flex items-start">
                    <NotebookPen className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                    Notes: {interview.notes}
                  </p>
                )}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 flex items-center">
                    <UserRound className="w-4 h-4 mr-2 text-gray-500" />
                    Recruiter: {interview.recruiter?.name || "N/A"} ({interview.recruiter?.email || "N/A"})
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    Status: <span className={`ml-1 font-semibold ${
                        interview.status === 'scheduled' ? 'text-blue-600' :
                        interview.status === 'completed' ? 'text-green-600' :
                        interview.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {interview.status}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApplicantMyInterviews;