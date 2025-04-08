import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const TeacherAttendance = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/teachers/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClubName(response.data.primaryClub);
      } catch (error) {
        console.error("Error fetching Teacher details:", error.response?.data?.message || error.message);
      }
    };

    fetchTeacherDetails();
  }, []);

  useEffect(() => {
    const fetchTeacherEvents = async () => {
      if (!clubName) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found. Please log in.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/events/${clubName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching teacher events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherEvents();
  }, [clubName]);


  const handleLockAttendance = async (eventId) => {
    // console.log("Locking attendance for event ID:", eventId);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/events/attendance/lock/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Attendance locked successfully:", response.data);
      toast.success("Attendance has been locked successfully!");
    } catch (error) {
      console.error("Error locking attendance:", error.response?.data?.message || error.message);
      toast.error("Failed to lock attendance.");
    }
  };


  const viewEventDetails = (eventId) => {
    navigate(`/teacher/event-attendance/${eventId}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800">Manage Student Attendance</h1>
        <p className="text-gray-600 mt-2">Review and approve attendance for {clubName} club events</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl text-gray-600 mt-4">No events found for {clubName} club.</p>
          <p className="text-gray-500 mt-2">Once events are created, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const pendingCount = event.attendance.filter(record => record.status === "Pending").length;
            const approvedCount = event.attendance.filter(record => record.status === "Approved").length;
            const totalCount = event.attendance.length;

            return (
              <div key={event._id} className="rounded-lg shadow-lg overflow-hidden bg-white transition-transform duration-300 hover:shadow-xl">
                <div className="bg-blue-600 p-4 text-white">
                  <h2 className="text-xl font-semibold">{event.eventName}</h2>
                  <p className="text-blue-100">Date: {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Club: {event.clubName}
                      </span>
                      {pendingCount > 0 && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {pendingCount} Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${totalCount > 0 ? (approvedCount / totalCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-600">
                      <span>{approvedCount} Approved</span>
                      <span>{totalCount} Total</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => viewEventDetails(event._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View Attendance Details
                    </button>
                  </div>

                  <div className="self-center mt-4">
                    <button
                      onClick={() => handleLockAttendance(event._id)}
                      className="px-4 mt-3  py-2 bg-green-500 text-white rounded-lg hover:bg-gray-800 transition duration-200"
                    >
                      Lock Attendance
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;