import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  clubHead: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Reference to Student model
  caption: { type: String, required: true }, // Changed 'content' to 'caption' for consistency
  imageUrl: { type: String }, // Changed 'image' to 'imageUrl' for clarity
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
