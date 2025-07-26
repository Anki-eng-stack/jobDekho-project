import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Assuming Spinner is a simple loading spinner component
import { LockKeyhole, Mail, KeyRound } from "lucide-react"; // Icons for visual appeal

export default function OTPVerify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in localStorage, maybe redirect back to OTP request or login
      toast.warn("Please request an OTP first.");
      navigate("/otp-request"); // Or "/login"
    }
    // Automatically focus on the OTP input once email is loaded
    document.getElementById("otp-input")?.focus();
  }, [navigate]); // Added navigate to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      toast.success("OTP verified — you're logged in!");
      localStorage.removeItem("otpEmail"); // Clean up stored email after successful verification

      const role = res.data.user.role;
      // Redirect based on user role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/applications"); // Default for regular users
      }
    } catch (err) {
      console.error("OTP verification error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "OTP verification failed. Please check the OTP or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          <LockKeyhole className="inline-block w-8 h-8 mr-3 text-indigo-600" /> Verify OTP
        </h2>
        <p className="text-center text-gray-600 mb-6 text-md">
          A One-Time Password has been sent to your email address. Please enter it below to log in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-verify" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email-verify" // Unique ID for label association
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out bg-gray-50 text-gray-700 cursor-not-allowed"
                required
                readOnly // Make email read-only as it comes from localStorage
                aria-label="Email address for OTP verification (pre-filled)"
              />
            </div>
          </div>
          <div>
            <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700 mb-1">One-Time Password (OTP)</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="otp-input" // Unique ID for label association
                placeholder="Enter your 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 tracking-wider font-mono text-lg"
                required
                maxLength="6" // Assuming a 6-digit OTP
                pattern="\d{6}" // Ensures only digits are entered
                title="Please enter a 6-digit OTP"
                aria-label="Enter the 6-digit One-Time Password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold text-lg"
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <LockKeyhole size={20} className="mr-2" /> Verify & Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}