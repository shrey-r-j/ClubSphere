import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  eventName: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  attendance: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
