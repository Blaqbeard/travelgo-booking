const mongoose = require("mongoose");
const Destination = require("../models/Destination");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

// Map of destination names to their correct image filenames
const imageMap = {
  "Phuket, Thailand": "phuket.jpg",
  "Kathmandu, Nepal": "kathmandu.jpg",
  "Kyoto, Japan": "kyoto.jpg",
  "Tokyo, Japan": "tokyo.jpg",
  "Barcelona, Spain": "barcelona.jpg",
  "Interlaken, Switzerland": "interlaken.jpg",
  "Florence, Italy": "florence.jpg",
  "Rome, Italy": "rome.jpg",
  "Zanzibar, Tanzania": "zanzibar.jpg",
  "Marrakech, Morocco": "marrakech.jpg",
  "Cape Town, South Africa": "capetown.jpg",
  "Cusco, Peru": "cusco.jpg",
  "Banff, Canada": "banff.jpg",
  "New York City, USA": "newyork.jpg",
  "Maui, Hawaii": "maui.jpg",
  "Rio de Janeiro, Brazil": "rio.jpg",
  Fiji: "fiji.jpg",
  "Queenstown, New Zealand": "queenstown.jpg",
  "Sydney, Australia": "sydney.jpg",
  "Auckland, New Zealand": "auckland.jpg",
  "Bali, Indonesia": "bali.jpg",
  "Santorini, Greece": "santorini.jpg",
  "Paris, France": "paris.jpg",
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
    const seen = new Set();
    for (const dest of all) {
      // Remove duplicates by name (keep the first occurrence)
      if (seen.has(dest.name)) {
        await Destination.deleteOne({ _id: dest._id });
        continue;
      }
      seen.add(dest.name);
      // Update image if in map
      if (imageMap[dest.name]) {
        dest.image = imageMap[dest.name];
        await dest.save();
      }
    }
    console.log("Images updated and duplicates removed.");
    process.exit(0);
  } catch (err) {
    console.error("Error updating images or removing duplicates:", err);
    process.exit(1);
  }
}

run();
