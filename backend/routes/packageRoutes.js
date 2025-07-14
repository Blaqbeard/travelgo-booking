const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

// GET all packages
router.get("/", packageController.getAllPackages);
// GET one package
router.get("/:id", packageController.getPackageById);
// POST create package
router.post("/", packageController.createPackage);
// PUT update package
router.put("/:id", packageController.updatePackage);
// DELETE package
router.delete("/:id", packageController.deletePackage);

module.exports = router;
