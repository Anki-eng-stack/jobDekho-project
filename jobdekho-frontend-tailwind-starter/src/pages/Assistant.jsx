import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles, Send } from "lucide-react";
import API from "../services/api";
import { toast } from "react-toastify";

const Assistant = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Ask me to find jobs, explain requirements, generate interview questions, draft job descriptions, or improve resume content.",
      jobs: [],
    },
  ]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message, jobs: [] }]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/assistant", { message });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.reply || "No response",
          jobs: res.data.jobs || [],
        },
      ]);
    } catch (err) {
      const errorText =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Assistant failed. Try again.";
      toast.error(errorText);
      setMessages((prev) => [...prev, { role: "assistant", text: errorText, jobs: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm flex flex-col h-[75vh]">
          <div className="px-4 py-3 border-b flex items-center gap-2 font-semibold text-gray-800">
            <Sparkles size={18} className="text-indigo-600" />
            Hiring Assistant
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((message, idx) => (
              <div key={`${message.role}-${idx}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${message.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-sm inline-flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about hiring..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-4 h-[75vh] overflow-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Suggested Prompts</h2>
          <ul className="space-y-2 text-sm">
            <li className="bg-gray-50 p-2 rounded border">Find React jobs in Delhi</li>
            <li className="bg-gray-50 p-2 rounded border">Explain requirements for this job role</li>
            <li className="bg-gray-50 p-2 rounded border">Generate interview questions for Node.js developer</li>
            <li className="bg-gray-50 p-2 rounded border">Write a job description for frontend intern</li>
            <li className="bg-gray-50 p-2 rounded border">Give resume improvement tips for fresher</li>
          </ul>

          <h3 className="text-md font-semibold text-gray-900 mt-5 mb-2">Latest Matched Jobs</h3>
          <div className="space-y-2">
            {messages
              .slice()
              .reverse()
              .find((m) => m.role === "assistant" && m.jobs?.length > 0)
              ?.jobs?.map((job) => (
                <div key={job._id} className="border rounded-lg p-2">
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
                  <Link to={`/jobs/${job._id}`} className="text-xs text-blue-600 hover:underline">
                    View details
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
