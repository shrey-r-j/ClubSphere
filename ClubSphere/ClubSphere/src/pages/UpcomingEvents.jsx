import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import axios from 'axios';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const { clubname } = useParams(); // Extracting clubname from URL

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`http://import.meta.env.VITE_BACKEND_URL:3000/api/events/${clubname}`);
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        if (clubname) {
            fetchEvents();
        }
    }, [clubname]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Events for {clubname}</h1>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
