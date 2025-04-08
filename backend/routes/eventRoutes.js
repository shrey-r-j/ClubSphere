import express from "express";
import Event from "../models/Event.js";
import Student from "../models/Student.js"; // Assuming you have a Student model

const router = express.Router();

// Fetch all events for a specific club
router.get("/:clubName", async (req, res) => {
  try {
    const { clubName } = req.params;
    if (!clubName) return res.status(400).json({ error: "Club name is required" });

    const events = await Event.find({ clubName });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create a new event with a Base64 image
router.post("/", async (req, res) => {
  try {
    const { clubName, eventName, description, date, image, imgType, credit_hours } = req.body;

    if (!clubName || !eventName || !description || !date || !image || !imgType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEvent = new Event({ clubName, eventName, description, date, image, imgType, attendance: [], credit_hours });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance for an event
router.post("/:eventId/attendance", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { attendance } = req.body; 

    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ message: "Attendance list is required" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Verify students exist
    const students = await Student.find({ rollNo: { $in: attendance } });

    if (students.length !== attendance.length) {
      return res.status(400).json({ message: "Some students not found in the database" });
    }

    attendance.forEach((roll) => {
      event.attendance.push({ rollNumber: roll, status: "Pending" });
    });

    await event.save();

    // Send only one response
    return res.status(200).json({ message: "Attendance marked successfully", attendance: event.attendance });

  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/student/:rollNumber", async (req, res) => {
  try {
    const events = await Event.find({ "attendance.rollNumber": req.params.rollNumber });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/proof/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rollNumber, proofImage, imgType } = req.body;

    if (!proofImage || !imgType) {
      return res.status(400).json({ message: "Proof image and type are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendanceRecord = event.attendance.find((entry) => entry.rollNumber === rollNumber);

    if (attendanceRecord) {
      // Update existing record
      attendanceRecord.proofImage = proofImage;
      attendanceRecord.imgType = imgType;
      attendanceRecord.status = "Pending"; // Reset to pending for approval
    } else {
      // Create new record
      event.attendance.push({
        rollNumber,
        proofImage,
        imgType,
        status: "Pending",
      });
    }

    await event.save();
    res.status(200).json({ message: "Proof uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading proof:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/details/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/update-attendance/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rollNumber, status } = req.body;

    if (!rollNumber || !status) {
      return res.status(400).json({ message: "Roll number and status are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendanceRecord = event.attendance.find((entry) => entry.rollNumber === rollNumber);

    if (attendanceRecord) {
      attendanceRecord.status = status;
      await event.save();
      res.status(200).json({ message: "Attendance status updated successfully!" });
    } else {
      res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/attendance/lock/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get approved students
    const approvedStudents = event.attendance.filter(att => att.status === "Approved");

    if (approvedStudents.length === 0) {
      return res.status(400).json({ message: "No approved attendance found" });
    }

    const creditHours = parseInt(event.credit_hours, 10);

    // Update students in bulk using `$inc`
    await Student.updateMany(
      { rollNo: { $in: approvedStudents.map(s => s.rollNumber) } }, 
      { $inc: { completedHours: creditHours } }
    );

    res.status(200).json({ message: "Attendance locked successfully!" });
  } catch (error) {
    console.error("Error locking attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
