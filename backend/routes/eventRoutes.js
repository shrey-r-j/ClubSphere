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
    const { clubName, eventName, description, date, image, imgType } = req.body;

    if (!clubName || !eventName || !description || !date || !image || !imgType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEvent = new Event({ clubName, eventName, description, date, image, imgType, attendance: [] });

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

      // Update event attendance
      event.attendance = [...new Set([...event.attendance, ...attendance])]; // Avoid duplicates
      await event.save();

      return res.status(200).json({ message: "Attendance marked successfully", attendance: event.attendance });

  } catch (error) {
      console.error("Error marking attendance:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
