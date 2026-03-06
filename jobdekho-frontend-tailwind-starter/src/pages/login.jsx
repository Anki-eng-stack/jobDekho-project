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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      toast.success("Login successful");

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
    <div className="mx-auto flex min-h-[78vh] max-w-md items-center">
      <form onSubmit={handleSubmit} className="jd-card w-full space-y-5 p-7 sm:p-8">
        <div>
          <h2 className="jd-title text-3xl">Welcome Back</h2>
          <p className="jd-subtitle mt-1">Login to continue on JobDekho.</p>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="jd-input"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="jd-input"
            required
          />
        </div>

        <button type="submit" className="jd-btn w-full" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </button>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link to="/forgot-password" className="jd-btn-secondary text-center">
            Forgot Password
          </Link>
          <Link
            to="/otp-request"
            className="jd-btn-secondary text-center"
            onClick={() => {
              if (formData.email) localStorage.setItem("otpEmail", formData.email);
            }}
          >
            Login via OTP
          </Link>
        </div>

        <p className="text-center text-sm text-slate-600">
          Do not have an account?{" "}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
