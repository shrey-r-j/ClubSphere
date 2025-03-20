import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useThemeStore } from "../store/useThemeStore";
import axios from "axios";
import { toast } from "react-hot-toast";

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset",
];

const ClubheadNavbar = () => {
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Fetch club name from backend using /me route
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
          to="/clubhead" 
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
          to="/clubhead/create-post" 
          className={({ isActive }) => 
            isActive 
              ? "text-lg mx-4 text-green-400 border-b-2 border-green-400 pb-1 transition-all duration-300"
              : "text-lg mx-4 hover:text-green-400 hover:border-b-2 hover:border-green-400 pb-1 transition-all duration-300"
          }
        >
          Create Post
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
              <p className="font-medium text-gray-900">{clubName || "Loading..."}</p>
            </div>

            <div className="px-4 py-2 hover:bg-gray-100">
              <div className="flex justify-between items-center">
                <span>Theme</span>
                <button 
                  onClick={toggleTheme} 
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {theme}
                </button>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClubheadNavbar;
