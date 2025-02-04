import express from "express";
import cors from "cors";
import axios from 'axios';
import pg from "pg";
import bcrypt, { hash } from "bcrypt";
const app=express();
const saltrounds=10;
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"club_sphere",
    password:"shrey",
    port:5432,
});
db.connect();
app.get('/',(req,res)=>{
    res.send('Server is ready');
});

app.post('/api/signup', async (req, res) => {
    try {
        const { rollNo, enrollmentNo, firstName, primaryClub, password } = req.body;
        if (!rollNo || !enrollmentNo || !firstName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const check=await db.query("SELECT * FROM students WHERE roll_no=$1",[rollNo]);
        if(check.rows.length>0){
            res.status(401).json({message:"Roll no already Registered "});
        }
        else
        {const hashedPassword = await bcrypt.hash(password, saltrounds); 

        await db.query(
            "INSERT INTO students (roll_no, enroll, Name, p_club, password) VALUES ($1, $2, $3, $4, $5)",
            [rollNo, enrollmentNo, firstName, primaryClub, hashedPassword]
        );
        res.status(201).json({ message: "User created successfully" });}
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create user" });
    }
});
  
app.post('/api/login',async(req,res)=>{
    const r=req.body.rollNo;
    const enter_password = req.body.password;
    try{
        const check=await db.query("SELECT * FROM students WHERE roll_no=$1",[r]);
        if(check.rows.length>0){
            const user=check.rows[0];
            const result = await bcrypt.compare(enter_password, user.password);
            
            if (result) {
                res.status(200).json({ message: "Login successful", user: { rollNo: user.roll_no, name: user.name } });
                
            } else {
                res.status(401).json({ error: "Invalid credentials" });
               
            }           
        }
    }
    catch(err){
    console.error(err);
    res.status(500).json({ error: "Server error" });
    }
});

app.listen(port,()=>{
    console.log(`Server is listening on ${port}`);
});