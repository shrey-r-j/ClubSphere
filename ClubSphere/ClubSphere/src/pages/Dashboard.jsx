import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const Dashboard = () => {
  const [completedHours, setCompletedHours] = useState(0);
  const totalHours = 30;
  
  useEffect(() => {
    const fetchHours = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:3000/api/students/me", {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Student Dashboard
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-52 h-52 mb-6">
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
              styles={buildStyles({
                textSize: "18px",
                pathColor: `rgba(79, 70, 229, ${percentage / 100})`,
                textColor: "#4F46E5",
                trailColor: "#F3F4F6",
              })}
            />
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="text-indigo-600 font-bold">{completedHours}/{totalHours} hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-700 h-3 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700">
              You've completed <span className="font-bold text-indigo-600">{completedHours}</span> out of <span className="font-bold text-indigo-600">{totalHours}</span> required hours
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.max(totalHours - completedHours, 0)} hours remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
