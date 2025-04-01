import express from "express";
import Post from '../models/Post.js'; // Ensure Post model is imported
import ClubHead from "../models/Clubhead.js";

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { clubName, caption, image, contentType } = req.body;
    // Check if the club head (student) exists
    const user = await ClubHead.findOne({ clubName });
    if (!user) {
      return res.status(404).json({ error: "Club head not found" });
    }

    const newPost = new Post({ clubName, caption, image, contentType });
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
    const posts = await Post.find().populate("clubName", "firstName"); // Only populating firstName
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:clubName", async (req, res) => {
  try {
    const { clubName } = req.params;

    const posts = await Post.find({ clubName }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching club posts:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
