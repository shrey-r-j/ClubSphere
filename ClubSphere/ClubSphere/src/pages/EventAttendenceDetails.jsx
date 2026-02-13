import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventAttendanceDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "pending", "approved", "rejected"
  const [searchTerm, setSearchTerm] = useState("");
  // New state for enlarged image modal
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://import.meta.env.VITE_BACKEND_URL:3000/api/events/details/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const updateAttendanceStatus = async (rollNumber, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://import.meta.env.VITE_BACKEND_URL:3000/api/events/update-attendance/${eventId}`,
        { rollNumber, status },
        { 
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          } 
        }
      );

      // Update local state
      setEvent(prevEvent => {
        if (!prevEvent) return null;
        
        return {
          ...prevEvent,
          attendance: prevEvent.attendance.map(record => 
            record.rollNumber === rollNumber ? { ...record, status } : record
          )
        };
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance status. Please try again.");
    }
  };

  // Function to open the enlarged image modal
  const openImageModal = (imageData, imageType) => {
    setEnlargedImage({
      src: `data:${imageType || 'image/jpeg'};base64,${imageData}`,
      type: imageType || 'image/jpeg'
    });
    // Add overflow hidden to body to prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close the enlarged image modal
  const closeImageModal = () => {
    setEnlargedImage(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const filteredAttendance = event?.attendance.filter(record => {
    const matchesFilter = filter === "all" || record.status.toLowerCase() === filter;
    const matchesSearch = record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const statusCounts = event?.attendance.reduce((acc, record) => {
    const status = record.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0 }) || { pending: 0, approved: 0, rejected: 0 };

  const filterButtons = [
    { id: "all", label: "All", count: event?.attendance.length || 0 },
    { id: "pending", label: "Pending", count: statusCounts.pending },
    { id: "approved", label: "Approved", count: statusCounts.approved },
    { id: "rejected", label: "Rejected", count: statusCounts.rejected },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Event not found or you don't have permission to view it.</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Events
      </button>

      {/* Event header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{event.eventName}</h1>
            <p className="text-gray-600 mt-1">Club: {event.clubName}</p>
            <p className="text-gray-500 mt-1">
              Date: {new Date(event.date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Pending: {statusCounts.pending}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Approved: {statusCounts.approved}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Rejected: {statusCounts.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(button => (
              <button
                key={button.id}
                onClick={() => setFilter(button.id)}
                className={`px-4 py-2 rounded-md flex items-center ${
                  filter === button.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {button.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === button.id
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {button.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      {filteredAttendance.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-gray-600 mt-4">No attendance records match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAttendance.map((record) => (
            <div 
              key={record.rollNumber} 
              className={`p-5 rounded-lg shadow-md ${
                record.status === "Pending" ? "bg-yellow-50 border-l-4 border-yellow-400" :
                record.status === "Approved" ? "bg-green-50 border-l-4 border-green-400" :
                "bg-red-50 border-l-4 border-red-400"
              }`}
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">Roll No: {record.rollNumber}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  record.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  record.status === "Approved" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {record.status}
                </span>
              </div>
              
              <div className="mt-4 flex flex-col md:flex-row gap-6">
                {record.proofImage && (
                  <div className="md:w-1/3">
                    <p className="text-sm text-gray-500 mb-2">Proof Image:</p>
                    <div 
                      className="w-full h-40 border rounded-lg overflow-hidden bg-white cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageModal(record.proofImage, record.imgType)}
                    >
                      <img 
                        src={`data:${record.imgType || 'image/jpeg'};base64,${record.proofImage}`} 
                        alt="Attendance Proof" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Actions:</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateAttendanceStatus(record.rollNumber, "Approved")}
                      disabled={record.status === "Approved"}
                      className={`px-4 py-2 rounded-md ${
                        record.status === "Approved" 
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateAttendanceStatus(record.rollNumber, "Rejected")}
                      disabled={record.status === "Rejected"}
                      className={`px-4 py-2 rounded-md ${
                        record.status === "Rejected" 
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      Reject
                    </button>
                    {record.status !== "Pending" && (
                      <button
                        onClick={() => updateAttendanceStatus(record.rollNumber, "Pending")}
                        className="px-4 mt-2 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Reset to Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>  
      )}

      {/* Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl w-full max-h-screen">
            {/* Close button */}
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
              onClick={closeImageModal}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Enlarged image */}
            <img 
              src={enlargedImage.src} 
              alt="Enlarged proof" 
              className="w-full h-auto max-h-screen object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking directly on the image
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAttendanceDetails;