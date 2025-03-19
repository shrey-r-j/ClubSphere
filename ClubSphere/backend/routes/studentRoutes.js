import express from "express";
import bcrypt from "bcrypt";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";
const router = express.Router();
const saltRounds = 10;
const JWT_KEY = "123";

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

    const token = jwt.sign({ rollNo: student.rollNo }, JWT_KEY);
    res.status(200).json({ message: "Login successful", token, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Authentication Middleware with Bearer Token
function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    // console.log(authHeader);
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, JWT_KEY);
    req.rollNo = decode.rollNo;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

// Get Student Details
router.get("/me", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.rollNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Student Progress
router.get("/:rollNo", auth, async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ completedHours: student.completedHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update Completed Hours (Club Head only)
router.put("/:rollNo", auth, async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { completedHours } = req.body;

    if (typeof completedHours !== "number" || completedHours < 0) {
      return res.status(400).json({ message: "Invalid hours value" });
    }

    const student = await Student.findOneAndUpdate(
      { rollNo },
      { completedHours },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Hours updated successfully", completedHours: student.completedHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
