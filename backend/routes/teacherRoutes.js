import express from "express";
import Teacher from "../models/Teacher.js";
import jwt from "jsonwebtoken";
import {auth3} from "../middleware/auth.middleware.js";
const JWT_KEY = "123";
const router = express.Router();



router.post("/login", async (req, res) => {
  try {
    const { ID, password } = req.body;

    if (!ID || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const teacher = await Teacher.findOne({ ID });
    if (!teacher) {
      return res.status(401).json({ error: "Teacher not found" });
    }

    if (password !== teacher.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ teacher : teacher.ID }, JWT_KEY);
    res.status(200).json({ message: "Login successful", token,teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", auth3, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ID: req.ID}); // Don't send password
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;