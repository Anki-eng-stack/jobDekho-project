import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Or your API instance, e.g., API from "../services/api"
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Assuming Spinner is a simple loading spinner component
import {
  // ⭐ REMOVED CalendarEdit from here ⭐
  UserRound, // For applicant name
  BriefcaseBusiness, // For job title
  CalendarCheck2, // For date input
  Video, // For online mode
  MapPin, // For offline mode / location input
  NotebookPen, // For notes
  Save, // For submit/save button
  Loader2, // For loading initial data
  Edit, // ⭐ ADDED Edit for the title icon ⭐
  XCircle, // ⭐ ADDED XCircle for status dropdown ⭐
  CheckCircle, // ⭐ ADDED CheckCircle for status dropdown ⭐
} from "lucide-react";

const EditInterview = () => {
  const { interviewId } = useParams(); // Get interview ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  const [interview, setInterview] = useState(null); // State to store fetched interview details
  const [loadingInitial, setLoadingInitial] = useState(true); // Loading state for fetching existing interview
  const [savingChanges, setSavingChanges] = useState(false); // Loading state for saving updates

  const [form, setForm] = useState({
    date: "",
    mode: "online",
    location: "", // Can be meeting link or physical address
    notes: "",
    status: "scheduled", // Allow recruiter to change status
  });

  // Fetch existing interview details on component mount
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      setLoadingInitial(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/interviews/${interviewId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedInterview = res.data; // Assuming backend sends interview object directly
        setInterview(fetchedInterview); // Store full interview object

        // Pre-fill the form with fetched data
        setForm({
          date: fetchedInterview.date ? new Date(fetchedInterview.date).toISOString().slice(0, 16) : "", // Format for datetime-local
          mode: fetchedInterview.mode || "online",
          location: fetchedInterview.location || "",
          notes: fetchedInterview.notes || "",
          status: fetchedInterview.status || "scheduled",
        });
        toast.success("Interview details loaded!");
      } catch (err) {
        console.error("Failed to load interview details:", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Failed to load interview details. It might not exist or you lack permission.");
        navigate("/recruiter/dashboard"); // Redirect if failed to load
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchInterviewDetails();
  }, [interviewId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingChanges(true);

    // Basic validation
    if (!form.date || !form.mode || !form.location) {
      toast.error("Please fill in all required fields (Date, Mode, Location).");
      setSavingChanges(false);
      return;
    }

    try {
      // API call to update the interview
      await axios.put(
        `http://localhost:5000/api/interviews/${interviewId}`,
        form, // Send the entire form data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Interview updated successfully!");
      // Navigate back to the applicants list for the job associated with this interview
      // This requires the 'interview' object to have 'application.job._id' or similar
      // For simplicity, navigating to recruiter dashboard or assuming you'll pass job ID
      // Make sure interview.application.job is populated from backend when fetching interview
      const jobId = interview?.application?.job?._id || interview?.job?._id; // Check both potential paths
      if (jobId) {
        navigate(`/recruiter/jobs/${jobId}/applicants`);
      } else {
        navigate("/recruiter/dashboard"); // Fallback
      }
    } catch (err) {
      console.error("Failed to update interview:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to update interview. Please check inputs and try again.");
    } finally {
      setSavingChanges(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-indigo-500" />
        <p className="ml-4 text-xl font-medium text-gray-700">Loading interview details...</p>
      </div>
    );
  }

  // If interview is null after loading, it means it wasn't found or an error occurred
  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center justify-center text-gray-600 bg-white p-12 rounded-2xl shadow-lg max-w-lg mx-auto border border-gray-200">
          {/* ⭐ Replaced CalendarEdit with XCircle for 'not found' ⭐ */}
          <XCircle className="w-16 h-16 text-red-400 mb-6 animate-pulse-slow" />
          <p className="text-xl font-medium text-gray-700 mb-2">Interview Not Found!</p>
          <p className="text-md text-gray-500 text-center">
            The interview details could not be loaded.
          </p>
          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          {/* ⭐ Replaced CalendarEdit with Edit for the title ⭐ */}
          <Edit className="inline-block w-8 h-8 mr-3 text-indigo-600" /> Edit Interview
        </h2>

        {/* Applicant and Job Info (Read-only) */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <UserRound className="w-6 h-6 mr-3 text-blue-600" />
            Applicant: <span className="ml-2 text-gray-800">{interview.applicant?.name || "N/A"}</span>
          </p>
          <p className="text-lg font-semibold text-blue-800 flex items-center">
            <BriefcaseBusiness className="w-6 h-6 mr-3 text-blue-600" />
            Job Title: <span className="ml-2 text-gray-800">{interview.job?.title || interview.jobTitle || "N/A"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interview Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              <CalendarCheck2 className="inline-block w-5 h-5 mr-2 text-gray-500" /> Interview Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800"
              required
            />
          </div>

          {/* Mode */}
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
              Mode
            </label>
            <div className="relative">
              <select
                id="mode"
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800"
                required
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              {form.mode === "online" ? (
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" size={20} />
              ) : (
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
              )}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Location / Meeting Link */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              {form.mode === "online" ? (
                <> <Video className="inline-block w-5 h-5 mr-2 text-purple-600" /> Meeting Link (e.g., Google Meet, Zoom URL)</>
              ) : (
                <> <MapPin className="inline-block w-5 h-5 mr-2 text-green-600" /> Physical Location (e.g., Office Address)</>
              )}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder={form.mode === "online" ? "https://meet.google.com/xyz" : "123 Main St, Anytown"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              <NotebookPen className="inline-block w-5 h-5 mr-2 text-gray-500" /> Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any specific instructions or details for the applicant/interviewer."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 h-28 resize-y"
            />
          </div>

          {/* Status Update (Optional: Allow recruiters to change status here) */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800"
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                {/* Add other relevant statuses if your model supports them, e.g., "rescheduled" */}
              </select>
              {form.status === "scheduled" && <CalendarCheck2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={20} />}
              {form.status === "completed" && <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />}
              {form.status === "cancelled" && <XCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" size={20} />}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={savingChanges}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold text-lg mt-8"
          >
            {savingChanges ? (
              <Spinner />
            ) : (
              <>
                <Save size={20} className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;