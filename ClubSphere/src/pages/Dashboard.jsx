import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const [completedHours, setCompletedHours] = useState(0);
  const totalHours = 30;
  
  useEffect(() => {
    const fetchHours = async () => {
      try {
        const rollNo = req.user.rollNo; 
        const response = await fetch(`http://localhost:3000/api/students/${rollNo}`);
        const data = await response.json();

        if (response.ok) {
          setCompletedHours(data.completedHours); 
        } else {
          console.error("Error fetching hours:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch completed hours:", error);
      }
    };

    fetchHours();
  }, []);

  const percentage = (completedHours / totalHours) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Student Dashboard
        </h2>

        <div className="flex flex-col items-center">
          {/* Circular Progress Bar */}
          <div className="w-52 h-52 mb-6">
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
              styles={buildStyles({
                textSize: "18px",
                fontWeight: "600",
                pathColor: `rgba(79, 70, 229, ${percentage / 100})`,
                textColor: "#4F46E5",
                trailColor: "#F3F4F6",
                strokeLinecap: "round",
              })}
            />
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="text-indigo-600 font-bold">{completedHours}/{totalHours} hours</span>
            </div>
            
            {/* Linear Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-700 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">
              You've completed <span className="font-bold text-indigo-600">{completedHours}</span> out of <span className="font-bold text-indigo-600">{totalHours}</span> required hours
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {totalHours - completedHours} hours remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
