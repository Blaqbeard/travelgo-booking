const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false, // URL or filename
  },
  destination: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false, // e.g., 'Group', 'Private', 'Luxury'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Package", PackageSchema);
