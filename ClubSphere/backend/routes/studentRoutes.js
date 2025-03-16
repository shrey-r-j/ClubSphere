import express from "express";
import bcrypt from "bcrypt";
import Student from "../models/Student.js";

const router = express.Router();
const saltRounds = 10;

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { rollNo, enrollmentNo, firstName, primaryClub, password } = req.body;

    if (!rollNo || !enrollmentNo || !firstName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(401).json({ message: "Roll no already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newStudent = new Student({
      rollNo,
      enrollmentNo,
      firstName,
      primaryClub,
      password: hashedPassword,
    });

    await newStudent.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    if (!rollNo || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;