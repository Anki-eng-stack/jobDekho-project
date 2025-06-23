const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:     { type: String, required: true },
  title:       { type: String },
  pros:        { type: String },
  cons:        { type: String },
  rating:      { type: Number, min: 1, max: 5, required: true },
  jobRole:     { type: String },
  yearsWorked: Number,
  upvotes:     { type: Number, default: 0 },
  reports:     { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
