// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // 👇 match router.post("/reset-password/:token", ...)
      await API.post(`/reset-password/${token}`, { newPassword });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50 flex justify-center"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Set New Password"}
        </button>
      </form>
    </div>
  );
}
