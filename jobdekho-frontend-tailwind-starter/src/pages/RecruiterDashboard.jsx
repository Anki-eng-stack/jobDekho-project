import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // For displaying notifications
import Spinner from "../components/Spinner"; // Assuming you have a Spinner component
import {
  BriefcaseBusiness, // For overall dashboard title
  PlusCircle, // For Post New Job button
  Building2, // For company name
  Users, // For applicants count
  Megaphone, // For no jobs posted yet
  MapPin, // For job location
  IndianRupee, // For salary
} from "lucide-react";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        // Ensure your backend endpoint /recruiter/jobs populates applications
        // or provides an applicantsCount for each job.
        // Example: If applications are populated:
        // const jobs = await Job.find({ recruiter: recruiterId }).populate('applications');
        // If your backend only sends job data, you might need a separate call
        // or update your backend to include applicant counts.
        const res = await API.get("/recruiter/jobs");
        setJobs(res.data.jobsPosted || []); // Use res.data.jobsPosted as per your controller
        toast.success("Your posted jobs loaded successfully!");
      } catch (err) {
        console.error("Failed to fetch recruiter jobs", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Failed to load your jobs. Please try again.");
      } finally {
        setLoading(false); // End loading regardless of success/failure
      }
    };
    fetchMyJobs();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <BriefcaseBusiness className="inline-block w-10 h-10 mr-3 text-indigo-600" /> My Posted Jobs
        </h2>

        {/* Post New Job Button */}
        <div className="flex justify-end mb-8">
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 font-semibold text-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            {/* Simple Tailwind CSS spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <Megaphone className="w-16 h-16 text-indigo-400 mb-6 animate-bounce-slow" />
            <p className="text-xl font-medium text-gray-700 mb-2 text-center">No jobs posted yet.</p>
            <p className="text-md text-gray-500 text-center mb-6">
              Start by posting your first job opening to attract top talent!
            </p>
            <Link
              to="/recruiter/post-job"
              className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
            >
              Post Your First Job Now!
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                  <BriefcaseBusiness className="w-5 h-5 mr-2 text-indigo-500" />
                  {job.title}
                </h3>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-gray-500" />
                  {job.company}
                </p>
                <p className="text-md text-gray-600 mb-1 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  {job.location}
                </p>
                <p className="text-md text-gray-600 mb-4 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2 text-gray-500" />
                  Salary: {new Intl.NumberFormat('en-IN').format(job.salary)}/year
                </p>

                {/* Display Applicants Count - Requires backend to populate 'applications' or send 'applicantsCount' */}
                <p className="text-md text-gray-600 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Applicants: <span className="font-semibold ml-1">{job.applicants?.length || 0}</span>
                </p>

                {/* Add a link to view applicants for this job */}
                {/* This route assumes you'll create a JobApplicantsList component for /recruiter/jobs/:jobId/applicants */}
                <Link
                  to={`/recruiter/jobs/${job._id}/applicants`}
                  className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 flex items-center justify-center text-sm font-medium"
                >
                  View Applicants
                </Link>

                {/* Link to view full job details (existing functionality) */}
                <Link
                  to={`/jobs/${job._id}`}
                  className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition-all duration-300 flex items-center justify-center text-sm font-medium"
                >
                  View Job Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;