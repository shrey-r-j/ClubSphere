import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaBook, FaStream, FaUserAlt, FaPalette } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useThemeStore } from "../store/useThemeStore";

export const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset",
];



const Navbar = () => {

  useEffect(() => {
      const fetchHours = async () => {
        try {
          const rollNo = req.user.rollNo; 
          const response = await fetch(`http://localhost:3000/api/students/${rollNo}`);
          const data = await response.json();
  
          if (response.ok) {
            setCompletedHours(data.completedHours);
          } else {
            console.error("Error fetching hours:", data.message);
          }
        } catch (error) {
          console.error("Failed to fetch completed hours:", error);
        }
      };
  
      fetchHours();
    }, []);

  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Close dropdown when clicking outside
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

  const toggleTheme = () => {
    const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(nextTheme);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
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
            `text-lg mx-4 ${isActive ? "text-blue-400" : "text-white hover:text-gray-300"}`
          }
          end
        >
          <div className="flex items-center">
            <FaStream className="mr-2" />
            <span>Feed</span>
          </div>
        </NavLink>
        
        <NavLink
          to="/student/clubs"
          className={({ isActive }) => 
            `text-lg mx-4 ${isActive ? "text-blue-400" : "text-white hover:text-gray-300"}`
          }
        >
          <div className="flex items-center">
            <FaBook className="mr-2" />
            <span>Clubs</span>
          </div>
        </NavLink>
      </div>

      <div className="flex items-center gap-4" ref={dropdownRef}>
      
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center justify-center focus:outline-none"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <FaUserCircle className="text-3xl cursor-pointer hover:text-blue-400" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-800 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-medium text-gray-900 truncate">{/* {rollNo} */}</p>
              </div>
              
              <NavLink
                to="/student/dashboard"
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors duration-150 flex items-center"
                onClick={closeDropdown}
              >
                <FaUserAlt className="mr-3 text-gray-600" />
                Dashboard
              </NavLink>
              
              <button
                onClick={() => {
                  toggleTheme();
                  closeDropdown();
                }}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors duration-150 flex items-center"
              >
                <FaPalette className="mr-3 text-gray-600" />
                Change Theme
              </button>
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <NavLink
                to="/logout"
                className="block px-4 py-2 hover:bg-red-50 text-red-600 transition-colors duration-150 flex items-center"
                onClick={closeDropdown}
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;