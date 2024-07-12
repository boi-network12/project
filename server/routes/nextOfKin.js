const express = require("express");
const router = express.Router();
const {
  addNextOfKin,
  updatesNextOfKin,
  deleteNextOfKin,
  getNextOfKinForUser,
} = require("../controllers/NextOfKinController");

// Add next of kin
router.post("/", addNextOfKin);

// Update next of kin
router.put("/:nextOfKinId", updatesNextOfKin);

// Delete next of kin
router.delete("/:nextOfKinId", deleteNextOfKin);

// Get all next of kin for a user
router.get("/:userId", getNextOfKinForUser);

module.exports = router;
