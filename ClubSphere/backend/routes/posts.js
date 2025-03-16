import express from "express";
import Post from '../models/Post.js'; // Ensure Post model is imported
import Student from "../models/Student.js"; // Ensure Student model is imported

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { clubHeadId, caption, imageUrl } = req.body;

    // Check if the clubHead (Student) exists
    const clubHead = await Student.findById(clubHeadId);
    if (!clubHead) {
      return res.status(404).json({ error: "Club head not found" });
    }

    const newPost = new Post({ clubHead: clubHeadId, caption, imageUrl });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("clubHead", "firstName"); // Only populating firstName
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;