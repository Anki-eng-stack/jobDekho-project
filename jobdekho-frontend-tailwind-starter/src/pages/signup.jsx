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
    role: "jobseeker"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👇 Post to /signup (not /auth/signup)
      const res = await API.post("/signup", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      toast.success("Signup successful!");

      const role = res.data.user.role;
      if (role === "recruiter") {
        navigate("/recruiter");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/applications");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up to JobDekho</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center"
        >
          {loading ? <Spinner /> : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
