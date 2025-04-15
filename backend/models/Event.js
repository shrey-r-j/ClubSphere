import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  proofImage: { type: String }, 
  imgType: { type: String }, 
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  creditGranted: { type: Boolean, default: false },
});

const eventSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  eventName: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  image: { type: String, required: true }, 
  imgType: { type: String, required: true }, 
  attendance: { type: [attendanceSchema], default: [] }, 
  credit_hours: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
