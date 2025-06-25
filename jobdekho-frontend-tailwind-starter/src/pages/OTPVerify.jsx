import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function OTPVerify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      toast.success("OTP verified — logged in!");
      localStorage.removeItem("otpEmail"); // Cleanup

      const role = res.data.user.role;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/applications");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="One-Time Password"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Verify & Login"}
        </button>
      </form>
    </div>
  );
}
