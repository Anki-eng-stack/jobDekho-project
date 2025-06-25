const Salary = require("../models/Salary");

exports.createSalary = async (req, res) => {
  try {
    const { jobTitle, company, location, salaryAmount } = req.body;
    const salary = await Salary.create({
      jobTitle,
      company,
      location,
      salaryAmount,
      postedBy: req.user.id,
    });
    res.status(201).json({ message: "Salary info added", salary });
  } catch (err) {
    res.status(500).json({ error: "Failed to add salary info" });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate("postedBy", "name email");
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch salaries" });
  }
};
