import mongoose from "mongoose";
import Teacher from "../models/Teacher.js"; 

const teacherData = [
  { ID: "100", primaryClub: "PASC" },
  { ID: "101", primaryClub: "Art Circle" },
  { ID: "102", primaryClub: "EDC" },
];

const populateTeachers = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/club_sphere", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Teacher.deleteMany();

    const teachers = teacherData.map((teacher) => ({
      ID: teacher.ID,
      password: teacher.primaryClub, 
      primaryClub: teacher.primaryClub,
    }));

    await Teacher.insertMany(teachers);
    console.log("Teachers populated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error populating teachers:", error);
    mongoose.connection.close();
  }
};

populateTeachers();
