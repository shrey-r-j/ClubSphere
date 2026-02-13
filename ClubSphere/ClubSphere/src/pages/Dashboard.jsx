import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const Dashboard = () => {
  const [completedHours, setCompletedHours] = useState(0);
  const totalHours = 30;

  // Extract primary color from computed styles
  const [primaryColor, setPrimaryColor] = useState("#4F46E5"); // Default fallback

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const themePrimary = rootStyles.getPropertyValue("--p").trim(); // Get primary color
    if (themePrimary) {
      setPrimaryColor(`hsl(${themePrimary})`);
    }
  }, []);
  
  useEffect(() => {
    const fetchHours = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
  
      try {
        const response = await axios.get("http://import.meta.env.VITE_BACKEND_URL:3000/api/students/me", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (response.data?.completedHours !== undefined) {
          setCompletedHours(response.data.completedHours);
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch completed hours:", error.response?.data?.message || error.message);
      }
    };
  
    fetchHours();
  }, []);
  
  const percentage = Math.min((completedHours / totalHours) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6">
      <div className="w-full max-w-lg bg-base-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-base-content">
          Student Dashboard
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-52 h-52 mb-6">
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
              styles={buildStyles({
                textSize: "18px",
                pathColor: primaryColor, // ✅ Dynamically set color
                textColor: primaryColor,
                trailColor: "hsl(var(--b3))",
              })}
            />
          </div>

          <div className="bg-primary/10 rounded-xl p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base-content/70 font-medium">Progress</span>
              <span className="text-primary font-bold">{completedHours}/{totalHours} hours</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-base-content">
              You've completed <span className="font-bold text-primary">{completedHours}</span> out of <span className="font-bold text-primary">{totalHours}</span> required hours
            </p>
            <p className="text-sm text-base-content/60 mt-1">
              {Math.max(totalHours - completedHours, 0)} hours remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;