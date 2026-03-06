import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      toast.success("Signup successful");

      const role = res.data.user.role;
      if (role === "recruiter") navigate("/recruiter");
      else if (role === "admin") navigate("/admin");
      else navigate("/applications");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-md items-center">
      <form onSubmit={handleSubmit} className="jd-card w-full space-y-5 p-7 sm:p-8">
        <div>
          <h2 className="jd-title text-3xl">Create Account</h2>
          <p className="jd-subtitle mt-1">Join JobDekho to apply and track jobs.</p>
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            className="jd-input"
            required
          />
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

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
            I am a
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="jd-select"
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="jd-btn w-full">
          {loading ? <Spinner /> : "Sign Up"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
