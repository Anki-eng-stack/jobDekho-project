import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Assuming Spinner is a simple loading spinner component

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      toast.success("Login successful!");

      if (user.role === "recruiter") navigate("/recruiter");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/applications");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-200 transform transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6 tracking-tight">
          Welcome Back to <span className="text-indigo-600">JobDekho</span>
        </h2>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold text-lg"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Login"}
        </button>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
          <Link
            to="/forgot-password"
            className="flex-1 text-center bg-yellow-500 text-white p-3 rounded-lg shadow-sm hover:bg-yellow-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 font-medium text-base"
          >
            Forgot Password
          </Link>
          <Link
            to="/otp-request"
            className="flex-1 text-center bg-purple-600 text-white p-3 rounded-lg shadow-sm hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 font-medium text-base"
            onClick={() => {
              if (formData.email) {
                localStorage.setItem("otpEmail", formData.email);
              }
            }}
          >
            Login via OTP
          </Link>
        </div>

        <p className="text-center text-base text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;