import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText,
  CalendarCheck,
  AlertCircle,
  ExternalLink,
  BriefcaseBusiness,
  Building2,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";

const STATUS_META = {
  applied: { label: "Applied", className: "bg-yellow-100 text-yellow-800" },
  shortlisted: { label: "Shortlisted", className: "bg-blue-100 text-blue-800" },
  interview_scheduled: { label: "Interview Scheduled", className: "bg-purple-100 text-purple-800" },
  selected: { label: "Selected", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  withdrawn: { label: "Withdrawn", className: "bg-gray-200 text-gray-700" },
};

const labelForStatus = (status) => STATUS_META[status]?.label || status || "Unknown";
const classForStatus = (status) => STATUS_META[status]?.className || "bg-gray-100 text-gray-700";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/applications/my");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications", err);
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    const socket = io("http://localhost:5000", { auth: { token } });
    socket.on("application:status-updated", () => {
      fetchApplications();
    });

    return () => socket.disconnect();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;

    try {
      await API.patch(`/applications/withdraw/${id}`);
      toast.success("Application withdrawn.");
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to withdraw application.");
    }
  };

  const isWithdrawAllowed = (status) => !["selected", "rejected", "withdrawn"].includes(status);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-tight drop-shadow-sm">
          <FileText className="inline-block w-9 h-9 mr-3 text-indigo-600" /> My Job Applications
        </h2>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <AlertCircle className="w-16 h-16 text-indigo-400 mb-6" />
            <p className="text-xl font-medium text-gray-700 mb-2">No applications found.</p>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 text-lg font-semibold"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <BriefcaseBusiness className="inline w-6 h-6 mr-2 text-indigo-500" />
                    {app.job?.title || "Untitled Job"}
                  </h3>
                  <p className="text-md text-gray-700 mb-2 flex items-center">
                    <Building2 className="inline w-5 h-5 mr-2 text-gray-500" />
                    {app.job?.company || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <CalendarCheck className="inline w-4 h-4 mr-2 text-gray-400" />
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${classForStatus(app.status)}`}>
                    {labelForStatus(app.status)}
                  </span>
                </div>

                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Application Timeline</p>
                  <ul className="space-y-2">
                    {(app.statusHistory || []).map((entry, idx) => (
                      <li key={`${entry.status}-${entry.date}-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
                        <Circle size={12} className="mt-1 text-indigo-500" />
                        <div>
                          <p className="font-medium">{labelForStatus(entry.status)}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
                          {entry.note ? <p className="text-xs text-gray-500">{entry.note}</p> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink size={16} className="mr-1" /> View Resume
                    </a>
                  )}
                </div>

                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => navigate(`/jobs/${app.job?._id}`)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                  >
                    Job Details
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/chat?jobId=${app.job?._id}&recruiterId=${app.job?.recruiter?._id || app.job?.recruiter || ""}`
                      )
                    }
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                  >
                    Message Recruiter
                  </button>
                  {isWithdrawAllowed(app.status) && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
                    >
                      <XCircle size={16} /> Withdraw
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
