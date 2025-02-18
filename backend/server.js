import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();
const saltRounds = 10;
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(session({
    secret: "TOP_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 30 } // 30 min session
}));


app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/club_sphere', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Student Schema
const studentSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    enrollmentNo: { type: String, required: true },
    firstName: { type: String, required: true },
    primaryClub: { type: String },
    password: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// Default Route
app.get('/', (req, res) => {
    res.send('Server is ready');
});

// User Registration Route
app.post('/api/signup', async (req, res) => {
    try {
        const { rollNo, enrollmentNo, firstName, primaryClub, password } = req.body;
        if (!rollNo || !enrollmentNo || !firstName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.status(401).json({ message: "Roll No already registered" });
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

// Passport Local Strategy
passport.use(new LocalStrategy(
    { usernameField: "rollNo", passwordField: "password" }, // 👈 Tell passport to use "rollNo" instead of "username"
    async (rollNo, password, done) => {
        try {
            console.log("Attempting login with Roll No:", rollNo);
            const student = await Student.findOne({ rollNo });

            if (!student) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                console.log("Invalid credentials");
                return done(null, false, { message: "Invalid credentials" });
            }

            console.log("Login successful:", student.rollNo);
            return done(null, student);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }
));


// Passport Serialize & Deserialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const student = await Student.findById(id);
        done(null, student);
    } catch (err) {
        done(err);
    }
});

// User Login Route using Passport
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: "Login successful", student: req.user });
});

// User Logout Route
app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {  // Destroy session from store
            if (err) {
                return res.status(500).json({ message: "Logout failed" });
            }
            res.clearCookie("connect.sid"); // Clear session cookie
            res.status(200).json({ message: "Logout successful" });
        });
    });
});


// Start Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
