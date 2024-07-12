const User = require("../models/user");
const NextOfKin = require("../models/NextOfKin");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");  

// Add next of kin
const addNextOfKin = [
  // Validation
  check("name").notEmpty().withMessage("Name is required"),
  check("relationship").notEmpty().withMessage("Relationship is required"),
  check("phoneNumber").notEmpty().withMessage("Phone number is required"),
  check("address").notEmpty().withMessage("Address is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, name, relationship, phoneNumber, address } = req.body;

    try {
      // Check if userId is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: "Invalid user ID format" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const nextOfKin = new NextOfKin({
        user: userId,
        name,
        relationship,
        phoneNumber,
        address
      });

      await nextOfKin.save();

      user.nextOfKin.push(nextOfKin._id);
      await user.save();

      res.status(201).json({
        message: "Next of kin added successfully",
        nextOfKin
      });
    } catch (error) {
      console.error("Error adding next of kin:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
];



const updatesNextOfKin = [
  // Validation
  check("name").notEmpty().withMessage("Name is required"),
  check("relationship").notEmpty().withMessage("Relationship is required"),
  check("phoneNumber").notEmpty().withMessage("Phone number is required"),
  check("address").notEmpty().withMessage("Address is required"),

  async (req, res) => {
    const { nextOfKinId } = req.params;  // Get nextOfKinId from params
    const { name, relationship, phoneNumber, address } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!mongoose.Types.ObjectId.isValid(nextOfKinId)) {
        return res.status(400).json({ msg: "Invalid next of kin ID format" });
      }

      const nextOfKin = await NextOfKin.findByIdAndUpdate(
        nextOfKinId,
        { name, relationship, phoneNumber, address },
        { new: true }
      );

      if (!nextOfKin) {
        return res.status(404).json({
          error: "Next of kin not found",
          message: "Next of kin not found",
        });
      }

      res.status(200).json({
        message: "Next of kin updated successfully",
        nextOfKin
      });
    } catch (error) {
      console.error("Error updating next of kin:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
];




// Delete next of kin
const deleteNextOfKin = async (req, res) => {
  const { nextOfKinId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(nextOfKinId)) {
    return res.status(400).json({ msg: "Invalid next of kin ID format" });
  }

  try {
    const nextOfKin = await NextOfKin.findByIdAndDelete(nextOfKinId);

    if (!nextOfKin) {
      return res.status(404).json({ error: "Next of kin not found", message: "Next of kin not found" });
    }

    const user = await User.findById(nextOfKin.user);
    if (user) {
      user.nextOfKin = user.nextOfKin.filter(id => id.toString() !== nextOfKinId);
      await user.save();
    }

    res.status(200).json({ message: "Next of kin deleted successfully", nextOfKin });
  } catch (error) {
    console.error("Error deleting next of kin:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};



// Get all next of kin for a user
const getNextOfKinForUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId).populate('nextOfKin');
    if (!user) {
      return res.status(404).json({ error: "User not found", message: "User not found" });
    }

    res.status(200).json({ message: "Next of kin retrieved successfully", nextOfKin: user.nextOfKin });
  } catch (error) {
    console.error("Error retrieving next of kin:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};



// Export controllers
module.exports = {
  addNextOfKin,
  updatesNextOfKin,
  deleteNextOfKin,
  getNextOfKinForUser
};
