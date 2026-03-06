import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BriefcaseBusiness, Building2, MapPin, IndianRupee } from "lucide-react";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await axios.get("http://localhost:5000/api/jobs");
        let availableJobs = jobsRes.data;

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const applicationsRes = await axios.get("http://localhost:5000/api/applications/my", {
              headers: { Authorization: `Bearer ${token}` },
            });

            const appliedJobIds = new Set(
              (applicationsRes.data.applications || [])
                .map((app) => app.jobId || app.job?._id)
                .filter(Boolean)
            );

            availableJobs = jobsRes.data.filter((job) => !appliedJobIds.has(job._id));
          } catch (applicationErr) {
            console.warn("Failed to fetch applications for filtering jobs:", applicationErr);
          }
        }

        setJobs(availableJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="space-y-6">
      <div className="jd-card px-6 py-5 sm:px-7">
        <h1 className="jd-title flex items-center gap-2 text-3xl">
          <BriefcaseBusiness className="h-7 w-7 text-brand-600" />
          Discover Jobs
        </h1>
        <p className="jd-subtitle mt-2">Explore opportunities that match your profile.</p>
      </div>

      {loading ? (
        <div className="jd-card flex h-56 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="jd-empty">No jobs currently available. Please check back later.</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article key={job._id} className="jd-card overflow-hidden p-5">
              {job.jobImage?.url ? (
                <img
                  src={job.jobImage.url}
                  alt={job.title}
                  className="mb-4 h-44 w-full rounded-xl border border-border object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x200/E0E7FF/6366F1?text=Job+Image";
                  }}
                />
              ) : (
                <div className="mb-4 flex h-44 w-full items-center justify-center rounded-xl border border-dashed border-border bg-slate-50 text-xs text-slate-500">
                  No image available
                </div>
              )}

              <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                <Building2 className="h-4 w-4 text-slate-500" />
                {job.company || "N/A"}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="h-4 w-4 text-slate-500" />
                {job.location || "N/A"}
              </p>

              <p className="mt-3 text-sm text-slate-600">
                {job.description || "No description available."}
              </p>

              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <IndianRupee className="h-4 w-4 text-emerald-600" />
                {job.salary ? `Salary: ${Number(job.salary).toLocaleString("en-IN")}` : "Salary not mentioned"}
              </p>

              <button onClick={() => navigate(`/jobs/${job._id}`)} className="jd-btn mt-4 w-full">
                View Details
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllJobs;
