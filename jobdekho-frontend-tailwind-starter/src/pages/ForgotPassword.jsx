import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Assuming Spinner is a simple loading spinner component
import { Mail, Send } from "lucide-react"; // Icons for visual appeal

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/request-reset", { email });
      toast.success("A password reset link has been sent to your email address!");
      setEmail(""); // Clear the input field
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to send reset link. Please check your email or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          <Mail className="inline-block w-8 h-8 mr-3 text-indigo-600" /> Forgot Password?
        </h2>
        <p className="text-center text-gray-600 mb-6 text-md">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-3 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold text-lg"
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Send size={20} className="mr-2" /> Send Reset Link
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}