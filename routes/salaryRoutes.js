const router = require("express").Router();
const { createSalary, getAllSalaries } = require("../controllers/SalaryController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSalary);
router.get("/", getAllSalaries);

module.exports = router;
