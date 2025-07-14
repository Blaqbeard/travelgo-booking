const Booking = require("../models/Booking");

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { userName, userEmail, packageId, numberOfPeople, date, status } =
      req.body;
    const newBooking = new Booking({
      userName,
      userEmail,
      packageId,
      numberOfPeople,
      date,
      status,
    });
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { userName, userEmail, packageId, numberOfPeople, date, status } =
      req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { userName, userEmail, packageId, numberOfPeople, date, status },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
