import React, { useEffect, useState } from "react";
import axios from "axios";

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [clubName, setClubName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchClubDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        setLoading(false);
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
        setError("Error fetching club details: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        setLoading(false);
        return;
      }
    
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/students/club/${clubName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching students: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };
    if (clubName) fetchStudents();
  }, [clubName]);

  const handleCheckboxChange = (rollNo) => {
    setSelectedStudents((prev) =>
      prev.includes(rollNo) ? prev.filter((r) => r !== rollNo) : [...prev, rollNo]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.rollNo));
    }
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    /* Uncomment when API is ready
    try {
      await axios.post(`http://localhost:3000/api/events/${eventId}/attendance`, {
        attendance: selectedStudents,
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      // Reset selections after successful submission
      setSelectedStudents([]);
    } catch (error) {
      setError("Error marking attendance: " + (error.response?.data?.message || error.message));
    } */
    
    // For testing
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
    console.log("Submitting attendance for:", selectedStudents);
  };

  const filteredStudents = students.filter(
    (student) => 
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.firstName && student.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl m-10 mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mark Attendance for {clubName}</h1>
        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded text-sm">
            Attendance submitted successfully!
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by roll number or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : students.length > 0 ? (
        <>
          <div className="mb-2 flex justify-between items-center px-3 py-2 bg-gray-100 rounded-t-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                onChange={handleSelectAll}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 font-medium text-gray-700">Select All</span>
            </div>
            <span className="text-sm text-gray-500">
              {selectedStudents.length} of {filteredStudents.length} selected
            </span>
          </div>
          
          <div className="border rounded-b-lg mb-4">
            {filteredStudents.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.rollNo} 
                    className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 ${
                      selectedStudents.includes(student.rollNo) ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`student-${student.rollNo}`}
                        checked={selectedStudents.includes(student.rollNo)}
                        onChange={() => handleCheckboxChange(student.rollNo)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded cursor-pointer"
                      />
                      <label 
                        htmlFor={`student-${student.rollNo}`}
                        className="ml-3 cursor-pointer flex flex-col"
                      >
                        <span className="font-medium text-gray-800">{student.firstName || "Student"}</span>
                      </label>
                    </div>
                    <span className="text-sm text-gray-500">
                      {student.rollNo}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No students match your search
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-gray-600">No students found for this club.</p>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={selectedStudents.length === 0}
        className={`mt-4 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full font-medium transition-colors ${
          selectedStudents.length === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {selectedStudents.length > 0 
          ? `Submit Attendance (${selectedStudents.length} students)`
          : "Select Students to Submit"}
      </button>
    </div>
  );
};

export default MarkAttendance;