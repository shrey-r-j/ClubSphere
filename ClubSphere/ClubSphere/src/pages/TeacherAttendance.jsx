import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  Calendar, 
  Download, 
  Eye, 
  Lock, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  FileDown
} from "lucide-react";

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

  const downloadCSV = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:3000/api/students/getall/hours");
  
      const eligibleStudents = response.data.filter(
        (student) => student.completedHours > 29
      );
      console.log(eligibleStudents);
      if (eligibleStudents.length === 0) {
        toast.error("No students have completed more than 30 hours.");
        return;
      }
  
      const csvHeader = ["Roll No", "First Name", "Credits Granted"];
      const csvRows = eligibleStudents.map((student) => [
        student.rollNo,
        student.firstName || "N/A",
        1 || 0,
      ]);
  
      const csvContent = [
        csvHeader.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
      // Create download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Eligible_Students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL
    } catch (error) {
      console.error("Download CSV Error:", error);
      toast.error("Failed to download CSV.");
    }
  };
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading events...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 transition-all hover:shadow-xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="mr-3 text-blue-600" size={28} />
              Manage Student Attendance
            </h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <Calendar className="mr-2 text-blue-500" size={18} />
              Review and approve attendance for <span className="font-semibold ml-1 mr-1">{clubName}</span>club events
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="mt-4 md:mt-0 px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FileDown className="mr-2" size={20} />
            Download Students CSV (30+ Hours)
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-100">
          <div className="flex justify-center">
            <Calendar className="w-20 h-20 text-gray-400" />
          </div>
          <p className="text-2xl text-gray-700 mt-6 font-medium">No events found for {clubName} club</p>
          <p className="text-gray-500 mt-3">Once events are created, they will appear here for attendance management</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => {
            const pendingCount = event.attendance.filter(record => record.status === "Pending").length;
            const approvedCount = event.attendance.filter(record => record.status === "Approved").length;
            const totalCount = event.attendance.length;
            const approvalPercentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

            return (
              <div key={event._id} className="rounded-xl shadow-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Calendar className="mr-2" size={20} />
                    {event.eventName}
                  </h2>
                  <p className="text-blue-100 mt-2 flex items-center">
                    <Clock className="mr-2" size={16} />
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between mb-5 gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                        <Users size={14} className="mr-1" />
                        Club: {event.clubName}
                      </span>
                      {pendingCount > 0 && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {pendingCount} Pending
                        </span>
                      )}
                      {approvedCount > 0 && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                          <CheckCircle size={14} className="mr-1" />
                          {approvedCount} Approved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-1 text-sm text-gray-600">
                      <span className="font-medium">Approval Progress</span>
                      <span className="font-medium">{approvalPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          approvalPercentage > 80 ? 'bg-green-600' : 
                          approvalPercentage > 50 ? 'bg-blue-600' : 
                          approvalPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${approvalPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{approvedCount} of {totalCount} approved</span>
                      <span>{totalCount - approvedCount} remaining</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={() => viewEventDetails(event._id)}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md"
                    >
                      <Eye className="mr-2" size={18} />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => handleLockAttendance(event._id)}
                      className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center shadow-md"
                    >
                      <Lock className="mr-2" size={18} />
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