// src/components/JobCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const JobCard = ({ job, user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 shadow rounded border hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-sm text-gray-600">
        {job.company} - {job.location}
      </p>
      <p className="text-sm text-gray-500">{job.description?.slice(0, 50)}...</p>
      <p className="text-sm text-gray-700 font-medium mt-1">Salary: {job.salary}</p>

      <div className="flex items-center gap-3 mt-4">
        <Link
          to={`/jobs/${job._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>

        {user?.role === "jobseeker" && (
          <button
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
