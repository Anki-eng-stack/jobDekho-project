import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText,
  CalendarCheck,
  AlertCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await API.get("/application/my"); // fixed endpoint
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancel = async (id) => {
    try {
      await API.delete(`/application/cancel/${id}`);
      toast.success("Application cancelled");
      fetchApplications();
    } catch (err) {
      toast.error("Failed to cancel application");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        📄 My Job Applications
      </h2>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center text-gray-600 mt-20">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-lg">You haven’t applied for any jobs yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex flex-col md:flex-row gap-4"
            >
              {/* Job Image */}
              {app.job?.jobImage?.url && (
                <img
                  src={app.job.jobImage.url}
                  alt={app.job.title}
                  className="w-full md:w-36 h-36 object-cover rounded"
                />
              )}

              <div className="flex-1">
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  <FileText className="inline w-5 h-5 mr-2 text-blue-500" />
                  {app.job?.title || "Untitled Job"}
                </h3>

                {/* Company */}
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Company:</span>{" "}
                  {app.job?.company || "N/A"}
                </p>

                {/* Status */}
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Status:</span> {app.status}
                </p>

                {/* Date */}
                <p className="text-sm text-gray-600 mb-2">
                  <CalendarCheck className="inline w-4 h-4 mr-1" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>

                {/* Resume Link */}
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                >
                  View Resume
                </a>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/jobs/${app.job?._id}`)}
                    className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  >
                    <ExternalLink size={16} /> Job Details
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                  >
                    <Trash2 size={16} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
