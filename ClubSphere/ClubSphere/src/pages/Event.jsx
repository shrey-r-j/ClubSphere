import React, { useState } from "react";
import axios from "axios";

const Event = ({ clubName }) => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validating inputs
    if (!eventName || !description || !date) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        clubName,
        eventName,
        description,
        date,
        attendance: [],
      };
      await axios.post("http://localhost:3000/api/events", eventData);
      alert("Event created successfully!");
      // Reset the form
      setEventName("");
      setDescription("");
      setDate("");
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Event for {clubName}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700" htmlFor="eventName">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="p-2 border rounded-md"
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded-md"
            placeholder="Enter event description"
            rows="4"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700" htmlFor="date">
            Event Date
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded-md"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default Event;
