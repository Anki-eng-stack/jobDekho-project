const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});
app.set("io", io);

const tmpDir = path.join(__dirname, "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", apiLimiter);

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/salaries", require("./routes/salaryRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/recruiter", require("./routes/recruiterRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.get("/", (req, res) => {
  res.send("JobDekho API is running");
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Server Error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
io.use((socket, next) => {
  try {
    const rawToken = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!rawToken) return next(new Error("Unauthorized"));
    const token = String(rawToken).replace(/^Bearer\s+/i, "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch (err) {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  if (socket.user?.id) {
    socket.join(`user:${socket.user.id}`);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
