import mongoose from "mongoose";
import ClubHead from "../models/Clubhead.js"; // Ensure the path is correct

const clubsData = [
  "PASC",
  "Art Circle",
  "EDC",
  "Nakshatra",
  "NSS",
  "IEEE",
  "PICTOREAL",
  "CSI",
  "ROBOTICS",
  "ETHIC-CRAFT",
  "AWS",
  "DEBSOC",
  "GDU",
];

const populateClubHeads = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/club_sphere", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await ClubHead.deleteMany(); // Clear existing data

    const clubHeads = clubsData.map((club) => ({
      clubName: club,
      password: club, // Keeping password as club name
    }));

    await ClubHead.insertMany(clubHeads);
    console.log("ClubHeads populated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error populating ClubHeads:", error);
  }
};

populateClubHeads();
