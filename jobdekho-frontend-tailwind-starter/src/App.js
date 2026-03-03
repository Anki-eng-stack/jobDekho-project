import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AllJobs from "./pages/AllJobs";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Reviews from "./pages/Reviews";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import AdminDashboard from "./pages/AdminDashboard";
import ApplyForm from "./pages/ApplyForm";
import ScheduleInterview from "./pages/ScheduleInterview";
import JobApplicantsList from "./pages/JobApplicantsList";
import EditInterview from "./pages/EditInterview";
import Chat from "./pages/Chat";
import Assistant from "./pages/Assistant";

// Auth flows
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OTPRequest from "./pages/OTPRequest";
import OTPVerify from "./pages/OTPVerify";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/otp-request" element={<OTPRequest />} />
          <Route path="/otp-verify" element={<OTPVerify />} />

          <Route
            path="/apply/:jobId"
            element={
              <ProtectedRoute role="jobseeker">
                <ApplyForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <Interviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <Assistant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute role="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute role="recruiter">
                <JobApplicantsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/interviews/schedule/:applicationId"
            element={
              <ProtectedRoute role="recruiter">
                <ScheduleInterview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/interviews/:interviewId/edit"
            element={
              <ProtectedRoute role="recruiter">
                <EditInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
