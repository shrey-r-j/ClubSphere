import React, { useState, useRef, useEffect } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const EventCreation = () => {
  const [clubName, setClubName] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

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

  const processFile = (file) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image type");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image must be smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          base64: reader.result.split(",")[1],
          contentType: file.type,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName.trim()) {
      toast.error("Event name is required");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!image) {
      toast.error("Please upload an event image");
      return;
    }
    const eventData = {
      clubName,
      eventName,
      description,
      date,
      image: image.base64,
      imgType: image.contentType,
    };
    try {
      await axios.post("http://localhost:3000/api/events", eventData);
      toast.success("Event created successfully");
      setEventName("");
      setDescription("");
      setDate("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white mt-10 p-8 rounded-2xl shadow-md border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl resize-none"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
        />
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {image ? (
            <div className="relative">
              <img src={image.preview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                <X className="text-gray-700" size={20} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <ImagePlus className="text-gray-400" size={48} />
              <p className="text-gray-500 mt-4">Click to upload event image</p>
              <span className="text-xs text-gray-400">PNG, JPG, GIF (max 5MB)</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Upload size={20} />
          <span>Create Event</span>
        </button>
      </form>
    </div>
  );
};

export default EventCreation;
