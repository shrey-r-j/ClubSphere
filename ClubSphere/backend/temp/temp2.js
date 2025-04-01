import mongoose from "mongoose";
import Event from "../models/Event.js"; // Ensure the path is correct

const dummyEvents = [
  {
    clubName: "PASC",
    eventName: "Introduction to Competitive Programming",
    description: "A beginner-friendly session on problem-solving strategies and coding contests.",
    date: new Date("2025-04-10T10:00:00Z"),
  },
  {
    clubName: "PASC",
    eventName: "Web Development Bootcamp",
    description: "A hands-on session covering frontend and backend development using MERN stack.",
    date: new Date("2025-04-15T14:00:00Z"),
  },
  {
    clubName: "PASC",
    eventName: "Data Structures & Algorithms Workshop",
    description: "Deep dive into essential data structures and algorithms with live coding.",
    date: new Date("2025-04-20T16:00:00Z"),
  },
  {
    clubName: "PASC",
    eventName: "Hackathon 101",
    description: "Tips and tricks for winning hackathons, from ideation to execution.",
    date: new Date("2025-04-25T11:00:00Z"),
  },
  {
    clubName: "PASC",
    eventName: "Git & GitHub Essentials",
    description: "Learn version control and collaboration techniques using Git and GitHub.",
    date: new Date("2025-04-30T17:00:00Z"),
  },
];

const populateEvents = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/club_sphere", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Event.deleteMany({ clubName: "PASC" }); // Clear existing PASC events

    await Event.insertMany(dummyEvents);
    console.log("PASC Events populated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error populating events:", error);
  }
};

populateEvents();
