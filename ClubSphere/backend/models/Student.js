import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  enrollmentNo: { type: String, required: true },
  firstName: { type: String, required: true },
  primaryClub: { type: String },
  password: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
