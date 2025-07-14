const Package = require("../models/Package");

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single package by ID
exports.getPackageById = async (req, res) => {
  try {
    const packageItem = await Package.findById(req.params.id);
    if (!packageItem) return res.status(404).json({ error: "Not found" });
    res.json(packageItem);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, image, destination, duration } = req.body;
    const newPackage = new Package({
      name,
      description,
      price,
      image,
      destination,
      duration,
    });
    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Update a package
exports.updatePackage = async (req, res) => {
  try {
    const { name, description, price, image, destination, duration } = req.body;
    const updated = await Package.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, destination, duration },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Delete a package
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
