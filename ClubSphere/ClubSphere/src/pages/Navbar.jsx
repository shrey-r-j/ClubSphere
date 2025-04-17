import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useThemeStore } from "../store/useThemeStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { THEMES } from "../constants";

//hi
const Navbar = () => {
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Fetch roll number from backend using /me route
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/students/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRollNo(response.data.rollNo);
      } catch (error) {
        console.error("Error fetching user details:", error.response?.data?.message || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const toggleTheme = () => {
    const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(nextTheme);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="ClubSphere Logo" className="h-10 w-10 mr-2" />
        <span className="text-xl font-semibold">ClubSphere</span>
      </div>

      <div className="flex items-center">
        <NavLink
          to="/student"
          className={({ isActive }) =>
            isActive
              ? "text-lg mx-4 text-blue-400 border-b-2 border-blue-400 pb-1 transition-all duration-300"
              : "text-lg mx-4 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all duration-300"
          }
          end
        >
          Feed
        </NavLink>
        <NavLink
          to="/student/clubs"
          className={({ isActive }) =>
            isActive
              ? "text-lg mx-4 text-blue-400 border-b-2 border-blue-400 pb-1 transition-all duration-300"
              : "text-lg mx-4 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all duration-300"
          }
        >
          Clubs
        </NavLink>
        <NavLink
          to="/student/proof"
          className={({ isActive }) =>
            isActive
              ? "text-lg mx-4 text-blue-400 border-b-2 border-blue-400 pb-1 transition-all duration-300"
              : "text-lg mx-4 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all duration-300"
          }
        >
          Upload Proof
        </NavLink>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <FaUserCircle className="text-3xl cursor-pointer hover:text-blue-400 transition-colors duration-300" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-800">
            <div className="px-4 py-3 border-b">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{rollNo || "Loading..."}</p>
            </div>

            <NavLink to="/student/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</NavLink>


            <NavLink to="/student/theme" className="block px-4 py-2 hover:bg-gray-100">Themes</NavLink>

            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;