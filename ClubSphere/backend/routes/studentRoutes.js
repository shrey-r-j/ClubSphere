import express from "express";
import bcrypt from "bcrypt";
import Student from "../models/Student.js";
import {auth} from "../middleware/auth.middleware.js";
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
    const token = jwt.sign({ rollNo: rollNo }, JWT_KEY);
    res.status(201).json({ message: "User created successfully", token });

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

router.get("/club/:clubName", async (req, res) => {
  try {
    const { clubName } = req.params;
    if (!clubName) return res.status(400).json({ error: "Club name is required" });

    const students = await Student.find({ primaryClub: clubName });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this club" });
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//gethours

router.get('/getall/hours',async (req, res) => {
  try {
    const students = await Student.find({}, 'rollNo firstName completedHours');
    res.json(students);
  } catch (error) {
    console.error("Error fetching students' hours:", error);
    res.status(500).json({ message: "Internal Server Error" });
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