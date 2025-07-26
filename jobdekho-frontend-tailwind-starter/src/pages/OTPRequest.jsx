import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Assuming Spinner is a simple loading spinner component
import { Mail, KeyRound } from "lucide-react"; // Icons for visual appeal

export default function OTPRequest() {
  const navigate = useNavigate();
  // Initialize email from localStorage, prioritizing it for user convenience
  const [email, setEmail] = useState(localStorage.getItem("otpEmail") || "");
  const [loading, setLoading] = useState(false);

  // Focus the email input on component mount if it's empty
  useEffect(() => {
    if (!email) {
      document.getElementById("email-otp-request")?.focus();
    }
  }, [email]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email });
      // Store email in localStorage so it can be pre-filled on the OTP verification page
      localStorage.setItem("otpEmail", email);
      toast.success("A One-Time Password (OTP) has been sent to your email!");
      navigate("/otp-verify"); // Redirect to the OTP verification page
    } catch (err) {
      console.error("OTP request error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to send OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          <KeyRound className="inline-block w-8 h-8 mr-3 text-indigo-600" /> Login via OTP
        </h2>
        <p className="text-center text-gray-600 mb-6 text-md">
          Enter your registered email address to receive a One-Time Password for a secure login.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-otp-request" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email-otp-request" // Unique ID for label association
              placeholder="your.email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
              aria-label="Enter your email address to receive OTP"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold text-lg"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Mail size={20} className="mr-2" /> Request OTP
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}