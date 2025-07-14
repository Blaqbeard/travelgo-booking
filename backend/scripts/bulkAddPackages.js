const mongoose = require("mongoose");
const Package = require("../models/Package");
const Destination = require("../models/Destination");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const packages = [
  // Existing packages
  {
    name: "Bali Escape",
    description:
      "7 days in Bali with guided tours, beach resorts, and cultural experiences.",
    price: 1200,
    image: "bali-escape.jpg",
    destination: "Bali, Indonesia",
    duration: "7 days",
    type: "Group",
  },
  {
    name: "Santorini Dream",
    description:
      "5 nights in Santorini with luxury accommodation and island hopping.",
    price: 1500,
    image: "santorini-dream.jpg",
    destination: "Santorini, Greece",
    duration: "5 nights",
    type: "Luxury",
  },
  {
    name: "Hawaiian Adventure",
    description: "10 days exploring Maui, volcanoes, and tropical beaches.",
    price: 2000,
    image: "hawaii.jpeg",
    destination: "Maui, Hawaii",
    duration: "10 days",
    type: "Private",
  },
  {
    name: "Parisian Getaway",
    description:
      "Romantic 6-day trip to Paris with city tours and fine dining.",
    price: 1800,
    image: "parisian-getaway.jpg",
    destination: "Paris, France",
    duration: "6 days",
    type: "Luxury",
  },
  {
    name: "Tokyo Nights",
    description:
      "8 days in Tokyo with city tours, sushi workshops, and tech experiences.",
    price: 1700,
    image: "tokyo-nights.jpg",
    destination: "Tokyo, Japan",
    duration: "8 days",
    type: "Group",
  },
  {
    name: "Cape Town Safari",
    description: "7 days in Cape Town with safari tours and wine tasting.",
    price: 1600,
    image: "capetown-safari.jpg",
    destination: "Cape Town, South Africa",
    duration: "7 days",
    type: "Private",
  },
  // New enhanced packages
  // {
  //   name: "Indonesian Islands Explorer",
  //   description:
  //     "12 days hopping across Bali, Lombok, and Komodo with snorkeling and volcano hikes.",
  //   price: 2200,
  //   image: "indonesia.jpeg",
  //   destination: "Bali, Indonesia",
  //   duration: "12 days",
  //   type: "Luxury",
  // },
  // {
  //   name: "Greek Isles Group Tour",
  //   description:
  //     "9 days group adventure through Santorini, Mykonos, and Crete with local guides.",
  //   price: 1350,
  //   image: "Santorini_Greece.jpg",
  //   destination: "Santorini, Greece",
  //   duration: "9 days",
  //   type: "Group",
  // },
  // {
  //   name: "Hawaii Family Fun",
  //   description:
  //     "6 nights in Maui with family-friendly activities and beach picnics.",
  //   price: 1100,
  //   image: "hawaii.jpeg",
  //   destination: "Maui, Hawaii",
  //   duration: "6 nights",
  //   type: "Private",
  // },
  // {
  //   name: "Paris Art & Culture",
  //   description:
  //     "5 days in Paris with museum passes, art workshops, and Seine river cruise.",
  //   price: 950,
  //   image: "paris.jpg",
  //   destination: "Paris, France",
  //   duration: "5 days",
  //   type: "Group",
  // },
  // {
  //   name: "Tokyo Foodie Tour",
  //   description:
  //     "7 days in Tokyo with street food tours, sushi making, and sake tasting.",
  //   price: 1400,
  //   image: "tokyo.jpg",
  //   destination: "Tokyo, Japan",
  //   duration: "7 days",
  //   type: "Private",
  // },
  // {
  //   name: "South Africa Luxury Safari",
  //   description:
  //     "10 days in Cape Town and Kruger with luxury lodges and private game drives.",
  //   price: 3200,
  //   image: "south-africa.jpg",
  //   destination: "Cape Town, South Africa",
  //   duration: "10 days",
  //   type: "Luxury",
  // },
  // {
  //   name: "Bali Wellness Retreat",
  //   description:
  //     "8 days of yoga, spa treatments, and healthy cuisine in Ubud, Bali.",
  //   price: 1800,
  //   image: "bali-escape.jpg",
  //   destination: "Bali, Indonesia",
  //   duration: "8 days",
  //   type: "Private",
  // },
  // {
  //   name: "Santorini Honeymoon",
  //   description:
  //     "7 nights in Santorini with private villa, sunset cruise, and wine tasting.",
  //   price: 2500,
  //   image: "santorini-dream.jpg",
  //   destination: "Santorini, Greece",
  //   duration: "7 nights",
  //   type: "Luxury",
  // },
  // {
  //   name: "Hawaii Adventure Group",
  //   description:
  //     "9 days in Maui with hiking, surfing lessons, and group excursions.",
  //   price: 1600,
  //   image: "hawaii.jpeg",
  //   destination: "Maui, Hawaii",
  //   duration: "9 days",
  //   type: "Group",
  // },
  // {
  //   name: "Paris Family Discovery",
  //   description:
  //     "8 days in Paris with family-friendly tours, Disneyland Paris, and river cruise.",
  //   price: 1700,
  //   image: "paris.jpg",
  //   destination: "Paris, France",
  //   duration: "8 days",
  //   type: "Private",
  // },
  // {
  //   name: "Tokyo Luxury Experience",
  //   description:
  //     "6 nights in Tokyo with 5-star hotels, private guides, and exclusive dining.",
  //   price: 2800,
  //   image: "tokyo.jpg",
  //   destination: "Tokyo, Japan",
  //   duration: "6 nights",
  //   type: "Luxury",
  // },
  // {
  //   name: "Cape Town Group Adventure",
  //   description:
  //     "8 days in Cape Town with group safaris, hiking, and city tours.",
  //   price: 1450,
  //   image: "capetown-safari.jpg",
  //   destination: "Cape Town, South Africa",
  //   duration: "8 days",
  //   type: "Group",
  // },
];

async function generatePackagesFromDestinations() {
  const destinations = await Destination.find({});
  const newPackages = [];
  destinations.forEach((dest) => {
    // Group package
    newPackages.push({
      name: `${dest.name.split(",")[0]} Group Adventure`,
      description: `Experience ${
        dest.name.split(",")[0]
      } with a group: guided tours, local cuisine, and vibrant city life.`,
      price: 1200 + Math.floor(Math.random() * 500),
      image: dest.image || "default.jpg",
      destination: dest.name,
      duration: "5 days",
      type: "Group",
    });
    // Luxury package
    newPackages.push({
      name: `${dest.name.split(",")[0]} Luxury Escape`,
      description: `Indulge in ${
        dest.name.split(",")[0]
      } luxury: 5-star hotels, private tours, and gourmet dining.`,
      price: 2200 + Math.floor(Math.random() * 800),
      image: dest.image || "default.jpg",
      destination: dest.name,
      duration: "7 days",
      type: "Luxury",
    });
  });
  return newPackages;
}

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
    // Keep old packages
    const oldPackages = [...packages];
    // Generate new packages from destinations
    const generatedPackages = await generatePackagesFromDestinations();
    // Avoid duplicates: only add if not already present (by name+type+destination)
    const existing = await Package.find({}, "name type destination");
    const existingSet = new Set(
      existing.map((p) => `${p.name}|${p.type}|${p.destination}`)
    );
    const uniqueGenerated = generatedPackages.filter(
      (pkg) => !existingSet.has(`${pkg.name}|${pkg.type}|${pkg.destination}`)
    );
    if (uniqueGenerated.length > 0) {
      await Package.insertMany([...oldPackages, ...uniqueGenerated]);
      console.log(
        `Bulk packages added! (${uniqueGenerated.length} new, ${oldPackages.length} old)`
      );
    } else {
      console.log("No new unique packages to add.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error adding packages:", err);
    process.exit(1);
  }
}

run();
