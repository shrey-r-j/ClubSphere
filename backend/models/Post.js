import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  caption: { type: String, required: true }, 
  image: { type: String }, 
  contentType: { type: String },
  createdAt: { type: Date, default: Date.now },
});


const Post = mongoose.model("Post", postSchema);

export default Post;
