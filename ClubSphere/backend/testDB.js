import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/club_sphere";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Force IPv4
    });
    console.log("✅ MongoDB Connected Successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

connectDB();
