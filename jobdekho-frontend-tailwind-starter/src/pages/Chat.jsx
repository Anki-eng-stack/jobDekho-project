import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import { toast } from "react-toastify";

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
    const res = await API.get("/chat/conversations");
    setConversations(res.data.conversations || []);
    return res.data.conversations || [];
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;
    const res = await API.get(`/chat/conversations/${conversationId}/messages`);
    setMessages(res.data.messages || []);
    await API.patch(`/chat/conversations/${conversationId}/read`);
    setConversations((prev) =>
      prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
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
        console.error("Failed to initialize chat:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [searchParams, role]);

  useEffect(() => {
    if (!token) return;
    const socket = io("http://localhost:5000", {
      auth: { token },
    });
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
      toast.error(err.response?.data?.error || "Failed to send message");
    }
  };

  const getPartnerName = (conversation) => {
    if (!conversation) return "Conversation";
    if (role === "recruiter") return conversation.candidateId?.name || "Candidate";
    return conversation.recruiterId?.name || "Recruiter";
  };

  if (loading) return <div className="p-6">Loading chat...</div>;

  return (
    <div className="h-[80vh] grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded-lg bg-white overflow-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No conversations yet.
            {role === "jobseeker"
              ? " Open a job and click Message Recruiter."
              : " Open an applicant and click Message Candidate."}
          </div>
        ) : conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => {
              setActiveConversationId(c._id);
              loadMessages(c._id);
            }}
            className={`w-full text-left p-3 border-b hover:bg-gray-50 ${
              c._id === activeConversationId ? "bg-blue-50" : ""
            }`}
          >
            <div className="font-semibold">{getPartnerName(c)}</div>
            <div className="text-xs text-gray-500">{c.jobId?.title}</div>
            <div className="text-sm text-gray-600 truncate">{c.lastMessage || "No messages yet"}</div>
            {(c.unreadCount || 0) > 0 ? (
              <span className="inline-flex mt-1 items-center justify-center min-w-6 h-6 px-2 rounded-full bg-red-500 text-white text-xs">
                {c.unreadCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="md:col-span-2 border rounded-lg bg-white flex flex-col">
        <div className="p-3 border-b font-semibold">
          {activeConversation ? `${getPartnerName(activeConversation)} - ${activeConversation.jobId?.title || ""}` : "Select a conversation"}
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-2">
          {messages.map((m) => {
            const senderId = m.senderId?._id || m.senderId;
            const mine = String(senderId) === String(myId);
            const seen = !mine ? true : (m.seenBy || []).length > 1;
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] p-2 rounded-lg ${mine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                  <div>{m.text}</div>
                  <div className={`text-[10px] mt-1 ${mine ? "text-blue-100" : "text-gray-500"}`}>
                    {new Date(m.createdAt).toLocaleString()} {mine ? `• ${seen ? "Seen" : "Sent"}` : ""}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSend} className="p-3 border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border rounded px-3 py-2"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
