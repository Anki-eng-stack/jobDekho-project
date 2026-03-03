import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness,
  UserRound,
  Mail,
  CalendarDays,
  Video,
  MapPin,
  Edit,
  PlusCircle,
  Loader2,
  FileText,
  Circle,
  Eye,
  Download,
} from "lucide-react";

const STATUS_META = {
  applied: { label: "Applied", className: "bg-yellow-100 text-yellow-800" },
  shortlisted: { label: "Shortlisted", className: "bg-blue-100 text-blue-800" },
  interview_scheduled: { label: "Interview Scheduled", className: "bg-purple-100 text-purple-800" },
  selected: { label: "Selected", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  withdrawn: { label: "Withdrawn", className: "bg-gray-200 text-gray-700" },
};

const statusLabel = (status) => STATUS_META[status]?.label || status || "Unknown";
const statusClass = (status) => STATUS_META[status]?.className || "bg-gray-100 text-gray-700";

const JobApplicantsList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("Job Applicants");
  const [applicants, setApplicants] = useState([]);
  const [statusSelection, setStatusSelection] = useState({});
  const [updatingId, setUpdatingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewResumeUrl, setPreviewResumeUrl] = useState("");
  const token = localStorage.getItem("token");

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applications = res.data.applications || [];
      setApplicants(applications);
      setStatusSelection(
        applications.reduce((acc, app) => {
          acc[app._id] = app.status;
          return acc;
        }, {})
      );

      if (applications.length > 0 && applications[0].job?.title) {
        setJobTitle(applications[0].job.title);
      } else {
        const jobRes = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobTitle(jobRes.data.title);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load applicants.");
      toast.error(err.response?.data?.error || "Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId, token]);

  useEffect(() => {
    if (!token) return undefined;
    const socket = io("http://localhost:5000", { auth: { token } });

    socket.on("application:status-updated", (payload) => {
      if (String(payload?.jobId) !== String(jobId)) return;
      fetchApplicants();
    });

    return () => socket.disconnect();
  }, [token, jobId]);

  const updateStatus = async (applicationId) => {
    const status = statusSelection[applicationId];
    if (!status) return;

    try {
      setUpdatingId(applicationId);
      await axios.patch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status, note: "Updated from recruiter dashboard" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application status updated.");
      fetchApplicants();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status.");
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
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
            onClick={() => navigate("/recruiter")}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 text-lg font-semibold"
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
            <p className="text-xl font-medium text-gray-700 mb-2 text-center">No applicants yet.</p>
            <Link
              to="/recruiter"
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 text-lg font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applicants.map((application) => (
              <li
                key={application._id}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <UserRound className="w-6 h-6 mr-3 text-purple-600" />
                    {application.user?.name || "N/A"}
                  </h3>
                  <p className="text-md text-gray-700 mb-1 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    {application.user?.email || "N/A"}
                  </p>
                  {application.skills?.length > 0 && (
                    <p className="text-sm text-gray-600">Skills: {application.skills.join(", ")}</p>
                  )}
                </div>

                <span className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass(application.status)}`}>
                  {statusLabel(application.status)}
                </span>

                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Timeline</p>
                  <ul className="space-y-2">
                    {(application.statusHistory || []).map((entry, idx) => (
                      <li key={`${entry.status}-${entry.date}-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
                        <Circle size={12} className="mt-1 text-indigo-500" />
                        <div>
                          <p className="font-medium">{statusLabel(entry.status)}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
                          {entry.note ? <p className="text-xs text-gray-500">{entry.note}</p> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  {application.resumeUrl && (
                    <>
                      <button
                        onClick={() => setPreviewResumeUrl(application.resumeUrl)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm"
                      >
                        <Eye size={16} /> Preview Resume
                      </button>
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        <Download size={16} /> Download
                      </a>
                    </>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/chat?jobId=${jobId}&candidateId=${application.user?._id || ""}`
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Message Candidate
                </button>

                <div className="flex gap-2">
                  <select
                    value={statusSelection[application._id] || application.status}
                    onChange={(e) =>
                      setStatusSelection((prev) => ({ ...prev, [application._id]: e.target.value }))
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => updateStatus(application._id)}
                    disabled={updatingId === application._id}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm disabled:opacity-60"
                  >
                    {updatingId === application._id ? "Saving..." : "Update"}
                  </button>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  {application.interview ? (
                    <>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" /> Interview Scheduled
                      </h4>
                      <p className="text-sm text-gray-700 mb-1">
                        Date: {new Date(application.interview.date).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700 mb-1 flex items-center">
                        {application.interview.mode === "online" ? (
                          <Video className="w-4 h-4 mr-2 text-purple-600" />
                        ) : (
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                        )}
                        {application.interview.mode}
                      </p>
                      <Link
                        to={`/recruiter/interviews/${application.interview._id}/edit`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center text-sm font-medium mt-3"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit Interview
                      </Link>
                    </>
                  ) : (
                    <Link
                      to={`/recruiter/interviews/schedule/${application._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center text-sm font-medium mt-3"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Schedule Interview
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {previewResumeUrl && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Resume Preview</h3>
              <button
                onClick={() => setPreviewResumeUrl("")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Close
              </button>
            </div>
            <div className="flex-1">
              <iframe title="Resume Preview" src={previewResumeUrl} className="w-full h-full rounded-b-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicantsList;
