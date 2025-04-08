import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  primaryClub: { type: String },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
