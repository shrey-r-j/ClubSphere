import React, { useEffect, useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [events, setEvents] = useState([]);
  const [clubName, setClubName] = useState("");

  useEffect(() => {
    const fetchClubDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/clubheads/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClubName(response.data.clubName);
      } catch (error) {
        console.error("Error fetching club details:", error.response?.data?.message || error.message);
      }
    };

    fetchClubDetails();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/events/${clubName}`);
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error); 
      }
    };

    fetchEvents();
  }, [clubName]);

  const markAttendance = async (eventId) => {
    /* try {
      await axios.post(`http://localhost:3000/api/events/${eventId}/attendance`, {
        rollNo: studentRollNo,
      });
      alert("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance.");
    } */
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Events for {clubName}</h1>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="p-4 border rounded-lg shadow">
              <h2 className="text-xl font-semibold">{event.eventName}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
              <button
                onClick={() => markAttendance(event._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Mark Attendance
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendance;
