const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
// const salaryRoutes = require('./routes/salaryRoutes');
// const interviewRoutes = require('./routes/interviewRoutes');
// const recruiterRoutes = require('./routes/recruiterRoutes');
// const adminRoutes = require('./routes/adminRoutes');

const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();
connectDB();

const app = express();

// Global Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());

// Rate Limiter (optional)
app.use('/api', apiLimiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reviews', reviewRoutes);
// app.use('/api/salaries', salaryRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/recruiter', recruiterRoutes);
// app.use('/api/admin', adminRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
