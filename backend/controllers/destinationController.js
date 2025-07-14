const Destination = require("../models/Destination");

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: "Not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new destination
exports.createDestination = async (req, res) => {
  try {
    const { name, description, image, region } = req.body;
    const newDestination = new Destination({
      name,
      description,
      image,
      region,
    });
    const saved = await newDestination.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Update a destination
exports.updateDestination = async (req, res) => {
  try {
    const { name, description, image, region } = req.body;
    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      { name, description, image, region },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Delete a destination
exports.deleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
