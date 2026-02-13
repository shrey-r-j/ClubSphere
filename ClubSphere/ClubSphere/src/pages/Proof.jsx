import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Upload, Image, Loader2 } from "lucide-react";

const Proof = () => {
  const [events, setEvents] = useState([]);
  const [proofImages, setProofImages] = useState({});
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://import.meta.env.VITE_BACKEND_URL:3000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRollNo(response.data.rollNo);
      } catch (error) {
        console.error("Error fetching user details:", error.response?.data?.message || error.message);
        toast.error("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!rollNo) return;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://import.meta.env.VITE_BACKEND_URL:3000/api/events/student/${rollNo}`);
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setEvents([]);
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [rollNo]);

  const handleFileChange = (eventId, file) => {
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImages((prev) => ({
          ...prev,
          [eventId]: { file, preview: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (eventId) => {
    if (!proofImages[eventId]?.file) {
      toast.error("Please upload an image for this event");
      return;
    }

    setUploading((prev) => ({ ...prev, [eventId]: true }));
    const file = proofImages[eventId].file;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];
      const payload = {
        rollNumber: rollNo,
        proofImage: base64String,
        imgType: file.type,
      };

      try {
        await axios.post(`http://import.meta.env.VITE_BACKEND_URL:3000/api/events/proof/${eventId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Proof uploaded successfully!");
        // Remove the preview after successful upload
        setProofImages((prev) => {
          const newState = { ...prev };
          delete newState[eventId];
          return newState;
        });
      } catch (error) {
        console.error("Error uploading proof:", error.response?.data?.message || error.message);
        toast.error("Failed to upload proof");
      } finally {
        setUploading((prev) => ({ ...prev, [eventId]: false }));
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read file");
      setUploading((prev) => ({ ...prev, [eventId]: false }));
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Proof</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Upload proof of participation for your registered events
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No Events Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't registered for any events that require proof of participation.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700"
            >
              {/* Event Image */}
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                {event.image ? (
                  <img
                    src={`data:${event.contentType};base64,${event.image}`}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {event.eventName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{event.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {event.credit_hours} Credit Hours
                  </div>
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-4">
                  {/* Preview */}
                  {proofImages[event._id]?.preview && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={proofImages[event._id].preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(event._id, e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                      <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {proofImages[event._id]?.file?.name || "Click to upload proof"}
                      </p>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={() => handleSubmit(event._id)}
                    disabled={uploading[event._id] || !proofImages[event._id]}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      uploading[event._id] || !proofImages[event._id]
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    } flex items-center justify-center gap-2`}
                  >
                    {uploading[event._id] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Proof</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Proof;