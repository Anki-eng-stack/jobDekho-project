// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/request-reset", { email });  // ✅ fixed endpoint
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
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
          className="w-full bg-yellow-500 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
