import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

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

    if (clubName) {
      fetchEvents();
    }
  }, [clubName]);


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Events for {clubName}</h1>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="p-4 border rounded-lg shadow-lg bg-white h-full flex flex-col">
              {event.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={`data:${event.contentType};base64,${event.image}`}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold">{event.eventName}</h2>
              <p className="text-gray-600 mt-2 flex-grow">{event.description}</p>
              <p className="text-gray-500 mt-2">
  Date: {new Date(event.date).toLocaleDateString()} | Credit Hours: {event.credit_hours}
</p>
              <NavLink
                to={`/clubhead/mark/${event._id}`}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
              >
                Mark Attendance
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendance;