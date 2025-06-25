import React, { useEffect, useState } from "react";
import API from "../services/api";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interviews/my");
        setInterviews(res.data.interviews);
      } catch (err) {
        console.error("Failed to load interviews", err);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Interviews</h2>
      {interviews.length === 0 ? (
        <p>No interviews scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {interviews.map((iv) => (
            <li key={iv._id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold">{iv.jobTitle}</h3>
              <p>Date: {new Date(iv.date).toLocaleString()}</p>
              <p>Mode: {iv.mode}</p>
              <p>Status: {iv.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Interviews;
