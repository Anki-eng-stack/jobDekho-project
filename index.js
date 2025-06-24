const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
// const salaryRoutes = require('./routes/salaryRoutes');
// const interviewRoutes = require('./routes/interviewRoutes');
// const recruiterRoutes = require('./routes/recruiterRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// Load .env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middlewares
app.use(express.json()); // Parse JSON request body
app.use(helmet());       // Set secure HTTP headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser()); // Parse cookies

// Apply rate limiter to all /api routes
app.use('/api', apiLimiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reviews', reviewRoutes);
// app.use('/api/salaries', salaryRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/recruiter', recruiterRoutes);
// app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 JobDekho API is running');
});

// Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
