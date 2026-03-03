const router = require("express").Router();
const {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

router.get("/jobs", protect, authorize("admin"), getAllJobsAdmin);
router.delete("/jobs/:id", protect, authorize("admin"), deleteJobAdmin);

module.exports = router;
