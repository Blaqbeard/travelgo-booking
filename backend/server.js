const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Allow specific origins for production
app.use(
  cors({
    origin: [
      "https://blaqbeard.github.io",
      "https://blaqbeard.github.io/",
      "http://localhost:3000",
      "http://localhost:5500",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  })
);

const destinationRoutes = require("./routes/destinationRoutes");
app.use("/api/destinations", destinationRoutes);

const packageRoutes = require("./routes/packageRoutes");
app.use("/api/packages", packageRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Use a single MONGO_URI if available, otherwise fallback to old method
const mongoUri =
  process.env.MONGO_URI ||
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=woody`;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
