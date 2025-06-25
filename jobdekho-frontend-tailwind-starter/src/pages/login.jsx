import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login to JobDekho</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Login"}
        </button>

        <div className="flex space-x-2">
          <Link
            to="/forgot-password"
            className="flex-1 text-center bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Forgot Password
          </Link>
          <Link
            to="/otp-request"
            className="flex-1 text-center bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            onClick={() => {
              // Save email if already entered for OTP prefill
              if (formData.email) {
                localStorage.setItem("otpEmail", formData.email);
              }
            }}
          >
            Login via OTP
          </Link>
        </div>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
