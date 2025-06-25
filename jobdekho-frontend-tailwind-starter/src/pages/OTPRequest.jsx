import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function OTPRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("otpEmail") || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email });    // ← auth prefix
      localStorage.setItem("otpEmail", email);
      toast.success("OTP sent to your email!");
      navigate("/otp-verify");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Login via OTP</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-2 rounded flex justify-center disabled:opacity-50"
        >
          {loading ? <Spinner /> : "Request OTP"}
        </button>
      </form>
    </div>
  );
}
