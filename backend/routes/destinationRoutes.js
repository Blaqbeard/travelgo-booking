const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");

// GET all destinations
router.get("/", destinationController.getAllDestinations);
// GET one destination
router.get("/:id", destinationController.getDestinationById);
// POST create destination
router.post("/", destinationController.createDestination);
// PUT update destination
router.put("/:id", destinationController.updateDestination);
// DELETE destination
router.delete("/:id", destinationController.deleteDestination);

module.exports = router;
