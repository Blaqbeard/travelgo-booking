const mongoose = require("mongoose");
const Destination = require("../models/Destination");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

// Map of destination names to types for fixing
const typeMap = {
  // Asia
  "Phuket, Thailand": "Beach",
  "Kathmandu, Nepal": "Mountain",
  "Kyoto, Japan": "Cultural",
  "Tokyo, Japan": "City",
  // Europe
  "Barcelona, Spain": "City",
  "Interlaken, Switzerland": "Adventure",
  "Florence, Italy": "Cultural",
  "Rome, Italy": "Cultural",
  // Africa
  "Zanzibar, Tanzania": "Beach",
  "Marrakech, Morocco": "Cultural",
  "Cape Town, South Africa": "Adventure",
  // Americas
  "Cusco, Peru": "Cultural",
  "Banff, Canada": "Mountain",
  "New York City, USA": "City",
  "Maui, Hawaii": "Beach",
  "Rio de Janeiro, Brazil": "Beach",
  // Oceania
  Fiji: "Beach",
  "Queenstown, New Zealand": "Adventure",
  "Sydney, Australia": "City",
  "Auckland, New Zealand": "City",
  // Others
  "Bali, Indonesia": "Beach",
  "Santorini, Greece": "Beach",
  "Paris, France": "Cultural",
};

async function run() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=woody`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    const all = await Destination.find();
    for (const dest of all) {
      const type = typeMap[dest.name] || dest.type || "";
      if (type) {
        dest.type = type;
        await dest.save();
      }
    }
    console.log("All destinations now have a valid type field.");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing destination types:", err);
    process.exit(1);
  }
}

run();
