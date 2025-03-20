import express from "express";
import ClubHead from "../models/Clubhead.js";
import jwt from "jsonwebtoken";
import {auth2} from "../middleware/auth.middleware.js";
const JWT_KEY = "123";
const router = express.Router();

// Clubhead Login Route
router.post("/login", async (req, res) => {
  try {
    const { clubName, password } = req.body;

    if (!clubName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const clubHead = await ClubHead.findOne({ clubName });
    if (!clubHead) {
      return res.status(401).json({ error: "Club not found" });
    }

    // Directly compare plain text password
    if (password !== clubHead.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ clubName : clubHead.clubName }, JWT_KEY);
    res.status(200).json({ message: "Login successful", token,clubHead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", auth2, async (req, res) => {
  try {
    const clubHead = await ClubHead.findOne({clubName: req.clubName}); // Don't send password
    if (!clubHead) {
      return res.status(404).json({ message: "ClubHead not found" });
    }
    res.json(clubHead);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
export default router;
