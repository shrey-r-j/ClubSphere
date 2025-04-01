import express from "express";
import Event from "../models/Event.js";

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

// Mark attendance for an event
router.post("/:eventId/attendance", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rollNo } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (!event.attendance.includes(rollNo)) {
      event.attendance.push(rollNo);
      await event.save();
    }

    res.json({ message: "Attendance marked successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
