import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BriefcaseBusiness, Users, UserCheck, Trophy, PlusCircle, Loader2 } from "lucide-react";
import API from "../services/api";

const STATUS_LABELS = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview",
  selected: "Selected",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_COLORS = {
  applied: "bg-yellow-500",
  shortlisted: "bg-blue-500",
  interview_scheduled: "bg-purple-500",
  selected: "bg-green-500",
  rejected: "bg-red-500",
  withdrawn: "bg-gray-500",
};

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/recruiter");
        setJobs(res.data.jobsPosted || []);
        setAnalytics(res.data.analytics || null);
      } catch (err) {
        const message = err.response?.data?.error || "Failed to load recruiter dashboard.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const maxStatusCount = useMemo(() => {
    const values = Object.values(analytics?.statusBreakdown || {});
    return values.length ? Math.max(...values, 1) : 1;
  }, [analytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg border p-8 max-w-md text-center">
          <p className="text-lg font-semibold text-gray-800">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-blue-900">Recruiter Analytics</h1>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle size={18} /> Post Job
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Jobs Posted</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 inline-flex items-center gap-2">
              <BriefcaseBusiness size={20} className="text-indigo-600" />
              {analytics?.totalJobsPosted || 0}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 inline-flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              {analytics?.totalApplications || 0}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Shortlisted Count</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 inline-flex items-center gap-2">
              <UserCheck size={20} className="text-purple-600" />
              {analytics?.shortlistedCount || 0}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Hired Count</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 inline-flex items-center gap-2">
              <Trophy size={20} className="text-green-600" />
              {analytics?.hiredCount || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h2>
            <div className="space-y-3">
              {Object.entries(STATUS_LABELS).map(([key, label]) => {
                const count = analytics?.statusBreakdown?.[key] || 0;
                const width = `${(count / maxStatusCount) * 100}%`;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${STATUS_COLORS[key]}`} style={{ width }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Jobs</h2>
            {jobs.length === 0 ? (
              <p className="text-sm text-gray-600">No jobs posted yet.</p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-3">
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                      >
                        View Applicants
                      </Link>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-300"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
