import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const app = express();
const saltRounds = 10;
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/club_sphere", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    enrollmentNo: { type: String, required: true },
    firstName: { type: String, required: true },
    primaryClub: { type: String },
    password: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.post('/api/signup', async (req, res) => {
    try {
        const { rollNo, enrollmentNo, firstName, primaryClub, password } = req.body;
        if (!rollNo || !enrollmentNo || !firstName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.status(401).json({ message: "Roll no already Registered" });
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newStudent = new Student({
            rollNo,
            enrollmentNo,
            firstName,
            primaryClub,
            password: hashedPassword,
        });
        
        await newStudent.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create user" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { rollNo, password } = req.body;
        if (!rollNo || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const student = await Student.findOne({ rollNo });
        if (!student) {
            return res.status(401).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
