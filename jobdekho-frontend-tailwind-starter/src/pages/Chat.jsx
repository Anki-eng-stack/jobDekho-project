import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import { toast } from "react-toastify";
import { Send, MessageSquare } from "lucide-react";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const myId = localStorage.getItem("userId");

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeConversationId),
    [conversations, activeConversationId]
  );

  const appendUniqueMessage = (message) => {
    if (!message?._id) return;
    setMessages((prev) => {
      if (prev.some((m) => m._id === message._id)) return prev;
      return [...prev, message];
    });
  };

  const loadConversations = async () => {
    try {
      const res = await API.get("/chat/conversations");
      const list = res.data.conversations || [];
      setConversations(list);
      return list;
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) {
        toast.error("Too many chat requests. Please wait a moment.");
      }
      return [];
    }
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      const res = await API.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(res.data.messages || []);

      await API.patch(`/chat/conversations/${conversationId}/read`);
      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) {
        toast.error("Rate limit hit. Please wait before refreshing messages.");
      } else {
        toast.error(err.response?.data?.error || "Failed to load messages");
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let loaded = await loadConversations();

        const jobId = searchParams.get("jobId");
        const recruiterId = searchParams.get("recruiterId");
        const candidateId = searchParams.get("candidateId");

        if (jobId && role === "jobseeker") {
          const res = await API.post("/chat/conversations", { jobId, recruiterId });
          const created = res.data.conversation;
          loaded = await loadConversations();
          setActiveConversationId(created._id);
          await loadMessages(created._id);
        } else if (jobId && role === "recruiter" && candidateId) {
          const res = await API.post("/chat/conversations", {
            jobId,
            recruiterId: localStorage.getItem("userId"),
            candidateId,
          });
          const created = res.data.conversation;
          loaded = await loadConversations();
          setActiveConversationId(created._id);
          await loadMessages(created._id);
        } else if (loaded.length > 0) {
          setActiveConversationId(loaded[0]._id);
          await loadMessages(loaded[0]._id);
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 429) {
          toast.error("Chat temporarily rate-limited. Please wait a moment.");
        } else {
          console.error("Failed to initialize chat:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [searchParams, role]);

  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", { auth: { token } });
    socketRef.current = socket;

    socket.on("chat:new-message", (payload) => {
      const incomingConversationId = payload?.conversation?._id || payload?.conversationId;
      if (!incomingConversationId) return;

      setConversations((prev) =>
        prev.map((c) =>
          c._id === incomingConversationId
            ? {
                ...c,
                lastMessage: payload.message?.text || c.lastMessage,
                lastMessageAt: payload.message?.createdAt || c.lastMessageAt,
                unreadCount:
                  activeConversationId === incomingConversationId
                    ? 0
                    : (c.unreadCount || 0) + 1,
              }
            : c
        )
      );

      if (activeConversationId === incomingConversationId) {
        appendUniqueMessage(payload.message);
        API.patch(`/chat/conversations/${incomingConversationId}/read`).catch(() => {});
      }
    });

    return () => socket.disconnect();
  }, [token, activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversationId) return;

    try {
      const res = await API.post("/chat/messages", {
        conversationId: activeConversationId,
        text,
      });
      appendUniqueMessage(res.data.message);
      setText("");
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("You are sending messages too quickly. Please slow down.");
      } else {
        toast.error(err.response?.data?.error || "Failed to send message");
      }
    }
  };

  const getPartnerName = (conversation) => {
    if (!conversation) return "Conversation";
    if (role === "recruiter") return conversation.candidateId?.name || "Candidate";
    return conversation.recruiterId?.name || "Recruiter";
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jd-chat-wrap {
          font-family:'DM Sans',sans-serif;
          height:calc(100vh - 120px); min-height:500px;
          display:grid; grid-template-columns:300px 1fr; gap:1.25rem;
        }
        @media(max-width:700px){ .jd-chat-wrap{ grid-template-columns:1fr; height:auto; } }

        .jd-conv-panel {
          background:white; border:1.5px solid #ede9fe; border-radius:18px;
          overflow:hidden; display:flex; flex-direction:column;
          box-shadow:0 4px 20px rgba(124,58,237,0.07);
        }
        .jd-conv-header {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          padding:1rem 1.1rem; flex-shrink:0;
          display:flex; align-items:center; gap:0.625rem;
        }
        .jd-conv-header-title { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:white; margin:0; }
        .jd-conv-header-sub   { font-size:0.72rem; color:#c4b5fd; margin:0; }
        .jd-conv-header-icon  { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

        .jd-conv-list { flex:1; overflow-y:auto; }
        .jd-conv-list::-webkit-scrollbar { width:4px; }
        .jd-conv-list::-webkit-scrollbar-thumb { background:#ddd6fe; border-radius:99px; }

        .jd-conv-item {
          display:flex; align-items:center; gap:0.75rem;
          padding:0.875rem 1rem; border-bottom:1px solid #f3f0ff;
          cursor:pointer; transition:background 0.15s; text-align:left; width:100%; background:none; border-left:none; border-right:none; border-top:none;
        }
        .jd-conv-item:hover { background:#faf9ff; }
        .jd-conv-item.active { background:#f5f3ff; border-left:3px solid #7c3aed; }

        .jd-conv-avatar {
          width:38px; height:38px; border-radius:11px; flex-shrink:0;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:800; color:white;
          position:relative;
        }

        .jd-conv-name    { font-weight:600; font-size:0.85rem; color:#1e1b4b; margin:0 0 1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
        .jd-conv-job     { font-size:0.72rem; color:#a78bfa; margin:0 0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
        .jd-conv-preview { font-size:0.75rem; color:#94a3b8; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }

        .jd-unread-badge {
          margin-left:auto; flex-shrink:0;
          min-width:20px; height:20px; border-radius:99px;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          color:white; font-size:0.65rem; font-weight:700;
          display:flex; align-items:center; justify-content:center; padding:0 5px;
          animation:jdPulse 2s infinite;
        }
        @keyframes jdPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }

        .jd-conv-empty { padding:2rem 1rem; text-align:center; font-size:0.82rem; color:#94a3b8; line-height:1.6; }

        .jd-main-panel {
          background:white; border:1.5px solid #ede9fe; border-radius:18px;
          overflow:hidden; display:flex; flex-direction:column;
          box-shadow:0 4px 20px rgba(124,58,237,0.07);
        }

        .jd-msg-header {
          padding:0.875rem 1.25rem; border-bottom:1px solid #f3f0ff;
          display:flex; align-items:center; gap:0.75rem; flex-shrink:0;
          background:#faf9ff;
        }
        .jd-msg-header-name { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:#1e1b4b; margin:0; }
        .jd-msg-header-sub  { font-size:0.75rem; color:#a78bfa; margin:0; }
        .jd-msg-header-dot  { width:8px; height:8px; border-radius:50%; background:#4ade80; margin-left:auto; box-shadow:0 0 5px #4ade80; }

        .jd-messages {
          flex:1; overflow-y:auto; padding:1.25rem;
          display:flex; flex-direction:column; gap:0.625rem;
        }
        .jd-messages::-webkit-scrollbar { width:4px; }
        .jd-messages::-webkit-scrollbar-thumb { background:#ddd6fe; border-radius:99px; }

        .jd-msg-row { display:flex; align-items:flex-end; gap:8px; }
        .jd-msg-row.mine { flex-direction:row-reverse; }
        .jd-msg-content { display:flex; flex-direction:column; max-width:min(65%, 420px); min-width:0; }

        .jd-msg-av {
          width:26px; height:26px; border-radius:7px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:0.65rem; font-weight:800;
        }
        .jd-msg-av.mine  { background:#f5f3ff; color:#7c3aed; border:1.5px solid #ddd6fe; }
        .jd-msg-av.other { background:linear-gradient(135deg,#7c3aed,#4f46e5); color:white; }

        .jd-msg-bubble {
          padding:0.625rem 1rem;
          border-radius:16px;
          font-size:0.9rem;
          line-height:1.55;
          word-break:break-word;
          overflow-wrap:anywhere;
          white-space:normal;
          display:inline-block;
          min-width:48px;
        }
        .jd-msg-bubble.mine  { background:linear-gradient(135deg,#7c3aed,#4f46e5); color:white; border-bottom-right-radius:4px; box-shadow:0 3px 12px rgba(124,58,237,0.25); }
        .jd-msg-bubble.other { background:#f5f3ff; color:#1e1b4b; border:1px solid #ede9fe; border-bottom-left-radius:4px; }

        .jd-msg-meta { font-size:0.68rem; margin-top:4px; display:flex; align-items:center; gap:3px; }
        .jd-msg-meta.mine  { color:rgba(255,255,255,0.65); justify-content:flex-end; }
        .jd-msg-meta.other { color:#94a3b8; justify-content:flex-start; }

        .jd-input-bar {
          padding:0.875rem 1.25rem; border-top:1px solid #f3f0ff;
          display:flex; gap:0.625rem; align-items:center; flex-shrink:0;
        }
        .jd-msg-input {
          font-family:'DM Sans',sans-serif; flex:1; font-size:0.875rem; color:#1e1b4b;
          background:#faf9ff; border:1.5px solid #ede9fe; border-radius:12px;
          padding:0.65rem 1rem; outline:none; transition:all 0.2s;
        }
        .jd-msg-input::placeholder { color:#c4b5fd; }
        .jd-msg-input:focus { border-color:#7c3aed; background:white; box-shadow:0 0 0 3px rgba(124,58,237,0.1); }

        .jd-send-btn {
          width:42px; height:42px; border-radius:12px; flex-shrink:0;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; box-shadow:0 4px 12px rgba(124,58,237,0.3);
        }
        .jd-send-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(124,58,237,0.42); }
        .jd-send-btn:disabled { opacity:0.4; cursor:not-allowed; }

        .jd-chat-loading {
          display:flex; align-items:center; justify-content:center; gap:0.75rem;
          height:calc(100vh - 120px); font-size:0.9rem; color:#7c3aed;
          font-family:'DM Sans',sans-serif;
        }
        .jd-spinner { width:28px; height:28px; border:3px solid #ede9fe; border-top-color:#7c3aed; border-radius:50%; animation:jdSpin 0.7s linear infinite; }
        @keyframes jdSpin { to{transform:rotate(360deg)} }

        .jd-no-conv {
          flex:1; display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:0.75rem; padding:2rem;
        }
        .jd-no-conv-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; color:#1e1b4b; margin:0; }
        .jd-no-conv-sub   { font-size:0.82rem; color:#94a3b8; margin:0; text-align:center; max-width:240px; line-height:1.6; }
      `}</style>

      {loading ? (
        <div className="jd-chat-loading">
          <div className="jd-spinner" />
          Loading conversations...
        </div>
      ) : (
        <div className="jd-chat-wrap">
          <div className="jd-conv-panel">
            <div className="jd-conv-header">
              <div className="jd-conv-header-icon">
                <MessageSquare size={15} color="white" />
              </div>
              <div>
                <p className="jd-conv-header-title">Messages</p>
                <p className="jd-conv-header-sub">
                  {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="jd-conv-list">
              {conversations.length === 0 ? (
                <div className="jd-conv-empty">
                  No conversations yet.
                  <br />
                  {role === "jobseeker"
                    ? "Open a job and click Message Recruiter."
                    : "Open an applicant and click Message Candidate."}
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c._id}
                    className={`jd-conv-item ${c._id === activeConversationId ? "active" : ""}`}
                    onClick={() => {
                      setActiveConversationId(c._id);
                      void loadMessages(c._id);
                    }}
                  >
                    <div className="jd-conv-avatar">{getInitials(getPartnerName(c))}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="jd-conv-name">{getPartnerName(c)}</p>
                      <p className="jd-conv-job">{c.jobId?.title || "Job"}</p>
                      <p className="jd-conv-preview">{c.lastMessage || "No messages yet"}</p>
                    </div>
                    {(c.unreadCount || 0) > 0 && <span className="jd-unread-badge">{c.unreadCount}</span>}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="jd-main-panel">
            {!activeConversation ? (
              <div className="jd-no-conv">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 80 80"
                  fill="none"
                  style={{ animation: "jdFloat 3s ease-in-out infinite" }}
                >
                  <rect x="8" y="14" width="46" height="34" rx="10" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
                  <path d="M12 48l4-8" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
                  <rect x="26" y="32" width="46" height="34" rx="10" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="2" />
                  <path d="M68 66l-4-8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="39" cy="49" r="3" fill="#7c3aed" opacity="0.4" />
                  <circle cx="49" cy="49" r="3" fill="#7c3aed" opacity="0.6" />
                  <circle cx="59" cy="49" r="3" fill="#7c3aed" />
                </svg>
                <p className="jd-no-conv-title">No conversation selected</p>
                <p className="jd-no-conv-sub">Pick a conversation from the left to start chatting</p>
              </div>
            ) : (
              <>
                <div className="jd-msg-header">
                  <div
                    className="jd-conv-avatar"
                    style={{ width: 36, height: 36, borderRadius: 10, fontSize: "0.75rem" }}
                  >
                    {getInitials(getPartnerName(activeConversation))}
                  </div>
                  <div>
                    <p className="jd-msg-header-name">{getPartnerName(activeConversation)}</p>
                    <p className="jd-msg-header-sub">{activeConversation.jobId?.title || "Job"}</p>
                  </div>
                  <div className="jd-msg-header-dot" />
                </div>

                <div className="jd-messages">
                  {messages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "2rem 0", color: "#c4b5fd", fontSize: "0.82rem" }}>
                      No messages yet - say hello!
                    </div>
                  )}

                  {messages.map((m) => {
                    const senderId = m.senderId?._id || m.senderId;
                    const mine = String(senderId) === String(myId);
                    const seen = !mine ? true : (m.seenBy || []).length > 1;

                    return (
                      <div key={m._id} className={`jd-msg-row ${mine ? "mine" : ""}`}>
                        <div className={`jd-msg-av ${mine ? "mine" : "other"}`}>
                          {mine ? "Me" : getInitials(getPartnerName(activeConversation))}
                        </div>
                        <div className="jd-msg-content">
                          <div className={`jd-msg-bubble ${mine ? "mine" : "other"}`}>
                            {m.text?.replace(/\n+/g, " ")}
                          </div>
                          <div className={`jd-msg-meta ${mine ? "mine" : "other"}`}>
                            {new Date(m.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {mine && <span>{seen ? "Seen" : "Sent"}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>

                <form onSubmit={onSend} className="jd-input-bar">
                  <input
                    className="jd-msg-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="jd-send-btn" disabled={!text.trim()}>
                    <Send size={16} color="white" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes jdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </>
  );
};

export default Chat;
