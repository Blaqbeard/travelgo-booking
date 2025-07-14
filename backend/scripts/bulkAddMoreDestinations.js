const mongoose = require("mongoose");
const Destination = require("../models/Destination");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const moreDestinations = [
  // Asia
  {
    name: "Kyoto, Japan",
    description: "Historic temples, cherry blossoms, and traditional culture.",
    image: "tokyo.jpg",
    region: "Asia",
  },
  // Europe
  {
    name: "Rome, Italy",
    description: "Ancient ruins, world-class cuisine, and vibrant city life.",
    image: "europe.jpg",
    region: "Europe",
  },
  // Africa
  {
    name: "Marrakech, Morocco",
    description: "Exotic markets, stunning palaces, and desert adventures.",
    image: "africa.jpg",
    region: "Africa",
  },
  // Americas
  {
    name: "Rio de Janeiro, Brazil",
    description:
      "Famous beaches, lively festivals, and breathtaking landscapes.",
    image: "americas.jpg",
    region: "Americas",
  },
  // Oceania
  {
    name: "Sydney, Australia",
    description:
      "Iconic Opera House, beautiful beaches, and vibrant city life.",
    image: "oceania.jpg",
    region: "Oceania",
  },
  {
    name: "Auckland, New Zealand",
    description: "Harbor city, Maori culture, and adventure sports.",
    image: "oceania.jpg",
    region: "Oceania",
  },
];

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
    await Destination.insertMany(moreDestinations);
    console.log("More destinations added!");
    process.exit(0);
  } catch (err) {
    console.error("Error adding more destinations:", err);
    process.exit(1);
  }
}

run();
