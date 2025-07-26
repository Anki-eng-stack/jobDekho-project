const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job"); // Needed for checking job recruiter in createInterview

// ✅ Recruiter schedules an interview (Manual Scheduling)
// This endpoint is typically called by a recruiter after reviewing an application
// It expects applicationId, date, mode, location, notes in the request body
exports.createInterview = async (req, res) => {
  try {
    const { applicationId, date, mode, location, notes } = req.body;
    const recruiterId = req.user.id; // Recruiter's ID from authenticated user

    // Get application details to link the interview correctly and get job/applicant IDs
    const application = await Application.findById(applicationId).populate("job user");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // ⭐ NEW: Authorization check - Ensure the current recruiter is the one associated with the job ⭐
    // Or if the current user is an admin
    if (application.job.recruiter.toString() !== recruiterId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to schedule an interview for this job." });
    }
    // ⭐ END NEW ⭐

    // Create the new interview
    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      applicant: application.user._id,
      recruiter: recruiterId, // Assign the logged-in recruiter as the interviewer
      date,
      mode,
      location,
      notes,
      jobTitle: application.job.title, // Store job title for easy retrieval
    });

    // Update the application status to 'interview_scheduled' and link the interview
    application.status = "interview_scheduled";
    application.interview = interview._id; // Link the newly created interview
    await application.save();

    res.status(201).json({ message: "Interview scheduled successfully", interview });
  } catch (err) {
    console.error("❌ Interview scheduling error:", err);
    res.status(500).json({ error: "Failed to schedule interview", detail: err.message });
  }
};

// ✅ Get all interviews (Admin or Recruiter for their own jobs)
exports.getAllInterviews = async (req, res) => {
  try {
    let query = {};
    // If the user is a recruiter, they should only see interviews related to their jobs.
    // This assumes the recruiter ID is stored on the Job model and that we can query Interviews by Job.recruiter.
    // A more robust solution might be to find all jobs by the recruiter, then find interviews for those jobs.
    // For simplicity, let's assume 'recruiter' field on Interview is the actual recruiter who scheduled it.
    if (req.user.role === 'recruiter') {
        query.recruiter = req.user.id;
    }
    // If Admin, no query filter needed.

    const interviews = await Interview.find(query) // Apply the query filter
      .populate("job", "title company")
      .populate("applicant", "name email")
      .populate("recruiter", "name email");

    res.json({ interviews });
  } catch (err) {
    console.error("❌ Get all interviews error:", err);
    res.status(500).json({ error: "Failed to fetch interviews", detail: err.message });
  }
};

// ✅ Get single interview by ID
// Used to fetch details of a specific interview (for edit view, or applicant view)
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("job", "title company")
      .populate("applicant", "name email")
      .populate("recruiter", "name email");

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // ⭐ FIX: Add Authorization Check ⭐
    // Only the recruiter who created this interview, the applicant of this interview, or an admin can view it.
    const isAuthorizedRecruiter = interview.recruiter.toString() === req.user.id;
    const isAuthorizedApplicant = interview.applicant.toString() === req.user.id; // If applicant needs to see their interview
    const isAdmin = req.user.role === "admin";

    if (!isAuthorizedRecruiter && !isAuthorizedApplicant && !isAdmin) {
      return res.status(403).json({ error: "Not authorized to view this interview" });
    }
    // ⭐ END FIX ⭐

    res.json(interview);
  } catch (err) {
    console.error("❌ Get interview by ID error:", err);
    res.status(500).json({ error: "Failed to fetch interview", detail: err.message });
  }
};

// ✅ Delete an interview
// Allows a recruiter (who scheduled it) or an admin to delete an interview
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Authorization check: Only the recruiter who created it or an admin can delete
    if (interview.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this interview" });
    }

    await interview.deleteOne(); // Use deleteOne() for Mongoose 6+

    // ⭐ Optional: Update the associated application status if interview is deleted ⭐
    // Find the application and set its interview field to null and status to something like 'shortlisted' or 'reviewed'
    const application = await Application.findById(interview.application);
    if (application) {
        application.interview = null;
        // Decide what status to revert to. 'shortlisted' or 'reviewed' might be appropriate.
        if (application.status === 'interview_scheduled') { // Only change if it was specifically scheduled
            application.status = 'shortlisted'; // Or 'reviewed', depending on your flow
        }
        await application.save();
    }
    // ⭐ End Optional ⭐

    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    console.error("❌ Delete interview error:", err);
    res.status(500).json({ error: "Failed to delete interview", detail: err.message });
  }
};

// ✅ Get interviews scheduled for the logged-in jobseeker
// This is for the applicant's dashboard to see their upcoming interviews
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ applicant: req.user.id })
      .populate("job", "title company") // Show job title and company
      .populate("recruiter", "name email") // Show recruiter details
      .sort({ date: 1 }); // Sort by date ascending (upcoming first)

    res.json({ interviews });
  } catch (err) {
    console.error("❌ Fetch My Interviews error:", err);
    res.status(500).json({ error: "Failed to fetch interviews", detail: err.message });
  }
};

// ✅ Update an interview (e.g., reschedule, change mode/location, add notes)
// Only the recruiter who created it or an admin can update an interview
exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Authorization check
    if (interview.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this interview" });
    }

    // Update fields from request body
    const { date, mode, location, notes, status } = req.body;
    if (date) interview.date = date;
    if (mode) interview.mode = mode;
    if (location) interview.location = location;
    if (notes) interview.notes = notes;
    if (status) interview.status = status; // Allows updating status (e.g., 'completed', 'cancelled')

    await interview.save();

    res.json({ message: "Interview updated successfully", interview });
  } catch (err) {
    console.error("❌ Update interview error:", err);
    res.status(500).json({ error: "Failed to update interview", detail: err.message });
  }
};