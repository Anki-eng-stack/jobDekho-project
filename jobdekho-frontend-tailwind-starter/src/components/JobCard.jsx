// src/components/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <div className="bg-white p-4 shadow rounded">
    <Link
      to={`/jobs/${job._id}`}
      className="text-lg font-semibold text-blue-600 hover:underline"
    >
      {job.title}
    </Link>
    <p className="text-sm text-gray-600">{job.company}</p>
    <p className="text-sm text-gray-500">{job.location}</p>
  </div>
);

export default JobCard;
