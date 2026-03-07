import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send, BriefcaseBusiness, MapPin, Building2 } from "lucide-react";
import API from "../services/api";
import { toast } from "react-toastify";

const PROMPTS = [
  { icon: "🔍", text: "Find React jobs in Delhi" },
  { icon: "📋", text: "Explain requirements for this job role" },
  { icon: "🎯", text: "Generate interview questions for Node.js developer" },
  { icon: "✍️", text: "Write a job description for frontend intern" },
  { icon: "📄", text: "Give resume improvement tips for fresher" },
];

const TypingDots = () => (
  <span style={{ display:"inline-flex", gap:3, alignItems:"center", padding:"2px 0" }}>
    {[0,1,2].map(i => (
      <span key={i} style={{
        width:7, height:7, borderRadius:"50%",
        background:"#a78bfa",
        animation:`jdDot 1.2s ease-in-out ${i*0.2}s infinite`,
        display:"inline-block",
      }}/>
    ))}
  </span>
);

const Assistant = () => {
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm your JobDekho AI Assistant. Ask me to find jobs, explain requirements, generate interview questions, draft job descriptions, or improve resume content.",
      jobs: [],
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    setMessages(prev => [...prev, { role:"user", text:message, jobs:[] }]);
    setInput("");
    setLoading(true);
    try {
      const res = await API.post("/assistant", { message });
      setMessages(prev => [...prev, { role:"assistant", text: res.data.reply || "No response", jobs: res.data.jobs || [] }]);
    } catch (err) {
      const errorText = err.response?.data?.detail || err.response?.data?.error || "Assistant failed. Try again.";
      toast.error(errorText);
      setMessages(prev => [...prev, { role:"assistant", text: errorText, jobs:[] }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrompt = (text) => {
    setInput(text);
  };

  const latestJobs = messages.slice().reverse().find(m => m.role === "assistant" && m.jobs?.length > 0)?.jobs || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-ai { font-family:'DM Sans',sans-serif; max-width:1100px; margin:0 auto; padding:1.5rem 1rem; }

        /* Layout */
        .jd-ai-grid { display:grid; grid-template-columns:1fr 300px; gap:1.25rem; height:calc(100vh - 140px); min-height:520px; }
        @media(max-width:860px){ .jd-ai-grid{ grid-template-columns:1fr; height:auto; } }

        /* Chat panel */
        .jd-chat-panel {
          background:white; border:1.5px solid #ede9fe; border-radius:20px;
          box-shadow:0 4px 24px rgba(124,58,237,0.08);
          display:flex; flex-direction:column; overflow:hidden;
        }

        .jd-chat-header {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1rem 1.25rem;
          display:flex; align-items:center; gap:0.75rem;
          flex-shrink:0;
        }
        .jd-chat-header-icon {
          width:36px; height:36px; border-radius:10px;
          background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25);
          display:flex; align-items:center; justify-content:center;
        }
        .jd-chat-header-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; color:white; margin:0; }
        .jd-chat-header-sub   { font-size:0.72rem; color:#c4b5fd; margin:0; }
        .jd-chat-header-dot   { width:8px; height:8px; border-radius:50%; background:#4ade80; margin-left:auto; box-shadow:0 0 6px #4ade80; }

        /* Messages */
        .jd-chat-messages {
          flex:1; overflow-y:auto; padding:1.25rem;
          display:flex; flex-direction:column; gap:0.75rem;
          scroll-behavior:smooth;
        }
        .jd-chat-messages::-webkit-scrollbar { width:4px; }
        .jd-chat-messages::-webkit-scrollbar-track { background:transparent; }
        .jd-chat-messages::-webkit-scrollbar-thumb { background:#ddd6fe; border-radius:99px; }

        .jd-msg-row { display:flex; gap:8px; align-items:flex-end; }
        .jd-msg-row.user { flex-direction:row-reverse; }

        .jd-msg-avatar {
          width:28px; height:28px; border-radius:8px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:0.75rem; font-weight:700;
        }
        .jd-msg-avatar.ai   { background:linear-gradient(135deg,#7c3aed,#4f46e5); color:white; }
        .jd-msg-avatar.user { background:#f5f3ff; color:#7c3aed; border:1.5px solid #ddd6fe; }

        .jd-msg-bubble {
          max-width:78%; padding:0.75rem 1rem; border-radius:14px;
          font-size:0.875rem; line-height:1.6; white-space:pre-wrap; word-break:break-word;
        }
        .jd-msg-bubble.ai   { background:#f5f3ff; color:#1e1b4b; border:1px solid #ede9fe; border-bottom-left-radius:4px; }
        .jd-msg-bubble.user { background:linear-gradient(135deg,#7c3aed,#4f46e5); color:white; border-bottom-right-radius:4px; box-shadow:0 4px 12px rgba(124,58,237,0.25); }

        .jd-typing-bubble {
          background:#f5f3ff; border:1px solid #ede9fe;
          border-radius:14px; border-bottom-left-radius:4px;
          padding:0.75rem 1rem; display:inline-flex; align-items:center; gap:4px;
        }

        /* Input area */
        .jd-chat-input-area {
          padding:1rem 1.25rem; border-top:1px solid #f3f0ff;
          display:flex; gap:0.625rem; align-items:center; flex-shrink:0;
        }
        .jd-chat-input {
          font-family:'DM Sans',sans-serif; flex:1;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:12px;
          padding:0.65rem 1rem; font-size:0.875rem; color:#1e1b4b;
          outline:none; transition:all 0.2s;
        }
        .jd-chat-input::placeholder { color:#c4b5fd; }
        .jd-chat-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        .jd-send-btn {
          width:42px; height:42px; border-radius:12px; flex-shrink:0;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; box-shadow:0 4px 12px rgba(124,58,237,0.3);
        }
        .jd-send-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(124,58,237,0.4); }
        .jd-send-btn:disabled { opacity:0.5; cursor:not-allowed; }

        /* Sidebar */
        .jd-sidebar {
          display:flex; flex-direction:column; gap:1rem;
          overflow-y:auto; max-height:calc(100vh - 140px);
        }
        @media(max-width:860px){ .jd-sidebar{ max-height:none; } }
        .jd-sidebar::-webkit-scrollbar { width:4px; }
        .jd-sidebar::-webkit-scrollbar-thumb { background:#ddd6fe; border-radius:99px; }

        .jd-sidebar-card {
          background:white; border:1.5px solid #ede9fe; border-radius:16px;
          overflow:hidden; box-shadow:0 2px 12px rgba(124,58,237,0.06);
        }
        .jd-sidebar-card-header {
          padding:0.875rem 1rem; border-bottom:1px solid #f3f0ff;
          background:#faf9ff;
        }
        .jd-sidebar-card-title {
          font-family:'Syne',sans-serif; font-size:0.9rem; font-weight:700;
          color:#1e1b4b; margin:0; display:flex; align-items:center; gap:6px;
        }

        /* Prompt chips */
        .jd-prompt-chip {
          display:flex; align-items:center; gap:8px;
          padding:0.625rem 0.875rem; margin:0 0.75rem 0;
          border-radius:10px; border:1.5px solid #ede9fe;
          background:#faf9ff; cursor:pointer; transition:all 0.2s;
          font-size:0.8rem; color:#374151; font-weight:500; text-align:left;
        }
        .jd-prompt-chip:first-of-type { margin-top:0.75rem; }
        .jd-prompt-chip:last-of-type  { margin-bottom:0.75rem; }
        .jd-prompt-chip:hover { border-color:#7c3aed; background:#f5f3ff; color:#7c3aed; }

        /* Job cards in sidebar */
        .jd-sidebar-job {
          padding:0.75rem 1rem; border-bottom:1px solid #f3f0ff;
          transition:background 0.2s;
        }
        .jd-sidebar-job:last-child { border-bottom:none; }
        .jd-sidebar-job:hover { background:#faf9ff; }
        .jd-sidebar-job-title { font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; color:#1e1b4b; margin:0 0 3px; }
        .jd-sidebar-job-meta  { font-size:0.75rem; color:#94a3b8; display:flex; align-items:center; gap:4px; margin-bottom:2px; }
        .jd-sidebar-job-link  { font-size:0.75rem; font-weight:600; color:#7c3aed; text-decoration:none; display:inline-flex; align-items:center; gap:3px; margin-top:4px; }
        .jd-sidebar-job-link:hover { text-decoration:underline; }

        .jd-empty-jobs { padding:1.25rem; text-align:center; font-size:0.8rem; color:#94a3b8; }

        @keyframes jdDot {
          0%,80%,100% { transform:scale(0.6); opacity:0.4; }
          40%          { transform:scale(1);   opacity:1; }
        }
      `}</style>

      <div className="jd-ai">

        {/* Page title */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.25rem" }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:800, color:"#1e1b4b", margin:0 }}>AI Hiring Assistant</h1>
            <p style={{ fontSize:"0.78rem", color:"#94a3b8", margin:0 }}>Powered by JobDekho AI · Ask anything about jobs</p>
          </div>
        </div>

        <div className="jd-ai-grid">

          {/* Chat Panel */}
          <div className="jd-chat-panel">

            {/* Header */}
            <div className="jd-chat-header">
              <div className="jd-chat-header-icon">
                <Sparkles size={16} color="white" />
              </div>
              <div>
                <p className="jd-chat-header-title">Hiring Assistant</p>
                <p className="jd-chat-header-sub">Ask me anything about jobs & hiring</p>
              </div>
              <div className="jd-chat-header-dot" />
            </div>

            {/* Messages */}
            <div className="jd-chat-messages">
              {messages.map((msg, idx) => (
                <div key={`${msg.role}-${idx}`} className={`jd-msg-row ${msg.role}`}>
                  <div className={`jd-msg-avatar ${msg.role === "user" ? "user" : "ai"}`}>
                    {msg.role === "user" ? "You" : "AI"}
                  </div>
                  <div className={`jd-msg-bubble ${msg.role === "user" ? "user" : "ai"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="jd-msg-row">
                  <div className="jd-msg-avatar ai">AI</div>
                  <div className="jd-typing-bubble">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="jd-chat-input-area">
              <input
                className="jd-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about hiring, jobs, interviews..."
              />
              <button type="submit" className="jd-send-btn" disabled={loading || !input.trim()}>
                <Send size={16} color="white" />
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="jd-sidebar">

            {/* Prompts */}
            <div className="jd-sidebar-card">
              <div className="jd-sidebar-card-header">
                <p className="jd-sidebar-card-title">✨ Suggested Prompts</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", padding:"0.75rem" }}>
                {PROMPTS.map((p, i) => (
                  <button key={i} className="jd-prompt-chip" style={{ margin:0 }} onClick={() => handlePrompt(p.text)}>
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Matched Jobs */}
            <div className="jd-sidebar-card">
              <div className="jd-sidebar-card-header">
                <p className="jd-sidebar-card-title"><BriefcaseBusiness size={14} color="#7c3aed" /> Matched Jobs</p>
              </div>
              {latestJobs.length === 0 ? (
                <p className="jd-empty-jobs">Ask me to find jobs and I'll show matches here 🔍</p>
              ) : (
                latestJobs.map((job) => (
                  <div key={job._id} className="jd-sidebar-job">
                    <p className="jd-sidebar-job-title">{job.title}</p>
                    <p className="jd-sidebar-job-meta"><Building2 size={11}/>{job.company}</p>
                    <p className="jd-sidebar-job-meta"><MapPin size={11}/>{job.location}</p>
                    <Link to={`/jobs/${job._id}`} className="jd-sidebar-job-link">
                      View details →
                    </Link>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Assistant;