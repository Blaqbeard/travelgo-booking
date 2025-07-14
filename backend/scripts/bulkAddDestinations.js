const mongoose = require("mongoose");
const Destination = require("../models/Destination");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const destinations = [
  {
    name: "Bali, Indonesia",
    description:
      "Tropical paradise with lush landscapes, vibrant culture, and stunning beaches.",
    image: "indonesia.jpeg",
    region: "Asia",
  },
  {
    name: "Santorini, Greece",
    description:
      "Iconic whitewashed buildings with blue domes overlooking the Aegean Sea.",
    image: "Santorini_Greece.jpg",
    region: "Europe",
  },
  {
    name: "Maui, Hawaii",
    description:
      "Volcanic landscapes, pristine beaches, and world-class resorts.",
    image: "hawaii.jpeg",
    region: "Americas",
  },
  {
    name: "Paris, France",
    description: "The City of Light with iconic landmarks, art, and cuisine.",
    image: "paris.jpg",
    region: "Europe",
  },
  {
    name: "Tokyo, Japan",
    description: "Where ancient traditions meet cutting-edge technology.",
    image: "tokyo.jpg",
    region: "Asia",
  },
  {
    name: "Cape Town, South Africa",
    description:
      "Stunning coastal city with Table Mountain and vibrant culture.",
    image: "south-africa.jpg",
    region: "Africa",
  },
];

async function run() {
  try {
    const connectionString =
      process.env.MONGO_URI ||
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=woody`;
    console.log("Connection string:", connectionString);
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Destination.insertMany(destinations);
    console.log("Bulk destinations added!");
    process.exit(0);
  } catch (err) {
    console.error("Error adding destinations:", err);
    process.exit(1);
  }
}

run();
