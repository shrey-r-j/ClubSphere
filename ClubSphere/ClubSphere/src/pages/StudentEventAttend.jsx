import React, { useState, useEffect } from "react";
import axios from "axios";


const AttendedEvents = () => {
    const [attendedEvents, setAttendedEvents] = useState([]);

    // Fetch attended events from backend
    useEffect(() => {
      const fetchAttendedEvents = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found. Please log in.");
          return;
        }
  
        try {
          const response = await axios.get("http://import.meta.env.VITE_BACKEND_URL:3000/api/students/events/attended", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          console.log("Fetched Attended Events:", response.data); // Debug log
          setAttendedEvents(response.data);
        } catch (error) {
          console.error("Failed to fetch attended events:", error.response?.data?.message || error.message);
        }
      };
  
      fetchAttendedEvents();
    }, []);
  
    
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Attended Events</h2>
      {attendedEvents.length === 0 ? (
        <p className="text-gray-600">No events attended yet.</p>
      ) : (
        <ul className="space-y-4">
          {attendedEvents.map((event) => (
            <li key={event._id} className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{event.eventName}</h3>
              <p className="text-gray-700">{event.clubName}</p>
              <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendedEvents;
