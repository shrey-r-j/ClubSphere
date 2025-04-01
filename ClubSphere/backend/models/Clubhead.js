import mongoose from "mongoose";

const clubHeadSchema = new mongoose.Schema({
  clubName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ClubHead = mongoose.model("ClubHead", clubHeadSchema);

export default ClubHead;