import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import studentRoutes from "./routes/studentRoutes.js";
import clubHeadRoutes from "./routes/clubHeadRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/clubheads', clubHeadRoutes);
app.use('/api/events', eventRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/club_sphere",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4, // Force IPv4
      }
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};


app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Start Server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
});
//End