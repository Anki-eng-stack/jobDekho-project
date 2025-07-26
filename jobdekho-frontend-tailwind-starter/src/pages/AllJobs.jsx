import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // For error notifications
import { BriefcaseBusiness, Building2, MapPin, IndianRupee, Megaphone } from "lucide-react"; // Icons for better visuals

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Failed to load jobs. Please try again later."); // User-friendly error
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight drop-shadow-sm">
          <BriefcaseBusiness className="inline-block w-10 h-10 mr-3 text-indigo-600" /> Discover Your Next Opportunity
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            {/* Simple Tailwind CSS spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg mt-20 max-w-lg mx-auto border border-gray-200">
            <Megaphone className="w-16 h-16 text-indigo-400 mb-6 animate-bounce-slow" />
            <p className="text-xl font-medium text-gray-700 mb-2">No jobs currently available.</p>
            <p className="text-md text-gray-500 text-center">Please check back later, new opportunities are posted regularly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col transform hover:-translate-y-1"
              >
                {/* Job Image - Conditional Rendering with Placeholder */}
                {job.jobImage?.url ? (
                  <img
                    src={job.jobImage.url}
                    alt={job.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/E0E7FF/6366F1?text=Job+Image"; }} // Fallback image
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4 text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  {job.title}
                </h2>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-gray-500" />
                  {job.company || "N/A"}
                </p>
                <p className="text-md text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  {job.location || "N/A"}
                </p>
                
                <p className="text-gray-600 text-sm flex-grow mb-4 leading-relaxed">
                  {job.description ? `${job.description.slice(0, 150)}...` : "No description available."}
                </p>
                
                <p className="text-md font-semibold text-gray-800 mb-5 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2 text-green-600" /> Salary: ₹{job.salary ? job.salary.toLocaleString('en-IN') : "Not mentioned"}
                </p>

                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="mt-auto bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 font-semibold text-lg"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllJobs;