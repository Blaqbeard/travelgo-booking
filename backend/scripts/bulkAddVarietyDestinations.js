const mongoose = require("mongoose");
const Destination = require("../models/Destination");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const varietyDestinations = [
  // Asia
  {
    name: "Phuket, Thailand",
    description: "Famous for its beaches and vibrant nightlife.",
    image: "asia.jpg",
    region: "Asia",
    type: "Beach",
  },
  {
    name: "Kathmandu, Nepal",
    description: "Gateway to the Himalayas and rich in culture.",
    image: "asia.jpg",
    region: "Asia",
    type: "Mountain",
  },
  // Europe
  {
    name: "Barcelona, Spain",
    description: "Stunning architecture, beaches, and vibrant city life.",
    image: "europe.jpg",
    region: "Europe",
    type: "City",
  },
  {
    name: "Interlaken, Switzerland",
    description: "Adventure capital with mountains and lakes.",
    image: "europe.jpg",
    region: "Europe",
    type: "Adventure",
  },
  // Africa
  {
    name: "Zanzibar, Tanzania",
    description: "Exotic beaches and spice markets.",
    image: "africa.jpg",
    region: "Africa",
    type: "Beach",
  },
  {
    name: "Marrakech, Morocco",
    description: "Cultural hub with markets and palaces.",
    image: "africa.jpg",
    region: "Africa",
    type: "Cultural",
  },
  // Americas
  {
    name: "Cusco, Peru",
    description: "Historic city and gateway to Machu Picchu.",
    image: "americas.jpg",
    region: "Americas",
    type: "Cultural",
  },
  {
    name: "Banff, Canada",
    description: "Majestic mountains and adventure sports.",
    image: "americas.jpg",
    region: "Americas",
    type: "Mountain",
  },
  // Oceania
  {
    name: "Fiji",
    description: "Tropical paradise with world-class beaches.",
    image: "oceania.jpg",
    region: "Oceania",
    type: "Beach",
  },
  {
    name: "Queenstown, New Zealand",
    description: "Adventure capital with stunning scenery.",
    image: "oceania.jpg",
    region: "Oceania",
    type: "Adventure",
  },
  // City examples
  {
    name: "New York City, USA",
    description: "The city that never sleeps.",
    image: "americas.jpg",
    region: "Americas",
    type: "City",
  },
  {
    name: "Sydney, Australia",
    description: "Iconic city with beaches and culture.",
    image: "oceania.jpg",
    region: "Oceania",
    type: "City",
  },
  // Cultural examples
  {
    name: "Kyoto, Japan",
    description: "Historic temples and cherry blossoms.",
    image: "asia.jpg",
    region: "Asia",
    type: "Cultural",
  },
  {
    name: "Florence, Italy",
    description: "Renaissance art and architecture.",
    image: "europe.jpg",
    region: "Europe",
    type: "Cultural",
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
    await Destination.insertMany(varietyDestinations);
    console.log("Variety destinations added!");
    process.exit(0);
  } catch (err) {
    console.error("Error adding variety destinations:", err);
    process.exit(1);
  }
}

run();
