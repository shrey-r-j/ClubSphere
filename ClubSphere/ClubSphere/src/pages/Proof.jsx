import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";


const Proof = () => {
  const [events, setEvents] = useState([]);
  const [proofImages, setProofImages] = useState({});
  const [rollNo, setRollNo] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRollNo(response.data.rollNo);
      } catch (error) {
        console.error("Error fetching user details:", error.response?.data?.message || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!rollNo) return;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/student/${rollNo}`);
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setEvents([]);
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [rollNo]);

  const handleFileChange = (eventId, file) => {
    setProofImages((prev) => ({ ...prev, [eventId]: file }));
  };

  const handleSubmit = async (eventId) => {
    if (!proofImages[eventId]) {
      toast.error("Please upload an image for this event");
      return;
    }
  
    const file = proofImages[eventId];
    const reader = new FileReader();
  
    reader.readAsDataURL(file); // Convert to Base64
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1]; // Extract base64 without prefix
      const payload = {
        rollNumber: rollNo,
        proofImage: base64String, // Send base64 string
        imgType: file.type, // Send MIME type
      };
  
      try {
        await axios.post(`http://localhost:3000/api/events/proof/${eventId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Proof uploaded successfully!");
      } catch (error) {
        console.error("Error uploading proof:", error.response?.data?.message || error.message);
        toast.error("Failed to upload proof");
      }
    };
  
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read file");
    };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Proof for Events</h1>
      {events.length === 0 ? (
        <p className="text-red-500">No events found or still loading...</p>
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(event._id, e.target.files[0])}
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={() => handleSubmit(event._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
              >
                Upload Proof
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Proof;
