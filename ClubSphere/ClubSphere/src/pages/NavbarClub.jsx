import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  PlusCircle, 
  Calendar, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Palette, 
  ChevronDown,
  Menu
} from "lucide-react";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-hot-toast";

const ClubheadNavbar = () => {
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fetch club name from backend using /me route
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
<nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">

      <div className="flex items-center">
        <img src={logo} alt="ClubSphere Logo" className="h-10 w-10 mr-2" />
        <span className="text-xl font-semibold">ClubSphere</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <NavLink
          to="/clubhead"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-400 border-b-2 border-blue-400 pb-1 transition-all duration-300"
              : "flex items-center hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all duration-300"
          }
          end
        >
          <Home size={20} className="mr-2" />
          <span>Feed</span>
        </NavLink>

        <NavLink
          to="/clubhead/post"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-green-400 border-b-2 border-green-400 pb-1 transition-all duration-300"
              : "flex items-center hover:text-green-400 hover:border-b-2 hover:border-green-400 pb-1 transition-all duration-300"
          }
        >
          <PlusCircle size={20} className="mr-2" />
          <span>Create Post</span>
        </NavLink>

        <NavLink
          to="/clubhead/event"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-green-400 border-b-2 border-green-400 pb-1 transition-all duration-300"
              : "flex items-center hover:text-green-400 hover:border-b-2 hover:border-green-400 pb-1 transition-all duration-300"
          }
        >
          <Calendar size={20} className="mr-2" />
          <span>Create Event</span>
        </NavLink>

        <NavLink
          to="/clubhead/attendence"
          className={({ isActive }) =>
            isActive
              ? "flex items-center text-blue-400 border-b-2 border-blue-400 pb-1 transition-all duration-300"
              : "flex items-center hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all duration-300"
          }
        >
          <Users size={20} className="mr-2" />
          <span>Event Attendance</span>
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="absolute top-16 left-0 right-0 bg-gray-800 shadow-lg z-50 md:hidden"
        >
          <NavLink
            to="/clubhead"
            className={({ isActive }) =>
              isActive
                ? "flex items-center p-4 text-blue-400 border-l-4 border-blue-400"
                : "flex items-center p-4 hover:bg-gray-700"
            }
            end
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home size={20} className="mr-3" />
            <span>Feed</span>
          </NavLink>

          <NavLink
            to="/clubhead/post"
            className={({ isActive }) =>
              isActive
                ? "flex items-center p-4 text-green-400 border-l-4 border-green-400"
                : "flex items-center p-4 hover:bg-gray-700"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <PlusCircle size={20} className="mr-3" />
            <span>Create Post</span>
          </NavLink>

          <NavLink
            to="/clubhead/event"
            className={({ isActive }) =>
              isActive
                ? "flex items-center p-4 text-blue-400 border-l-4 border-blue-400"
                : "flex items-center p-4 hover:bg-gray-700"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Calendar size={20} className="mr-3" />
            <span>Create Event</span>
          </NavLink>

          <NavLink
            to="/clubhead/attendence"
            className={({ isActive }) =>
              isActive
                ? "flex items-center p-4 text-blue-400 border-l-4 border-blue-400"
                : "flex items-center p-4 hover:bg-gray-700"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users size={20} className="mr-3" />
            <span>Event Attendance</span>
          </NavLink>

          <NavLink
            to="/clubhead/dashboard"
            className={({ isActive }) =>
              isActive
                ? "flex items-center p-4 text-blue-400 border-l-4 border-blue-400"
                : "flex items-center p-4 hover:bg-gray-700"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} className="mr-3" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/clubhead/theme"
            className={({ isActive }) =>
              isActive
                ? "flex items-center p-4 text-blue-400 border-l-4 border-blue-400"
                : "flex items-center p-4 hover:bg-gray-700"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Palette size={20} className="mr-3" />
            <span>Themes</span>
          </NavLink>

          <button 
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }} 
            className="w-full flex items-center p-4 text-red-400 hover:bg-gray-700"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 bg-gray-700 rounded-full px-3 py-2 hover:bg-gray-600 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            {clubName ? clubName.charAt(0).toUpperCase() : "C"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{clubName || "Loading..."}</p>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-800">
            <div className="px-4 py-3 border-b">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{clubName || "Loading..."}</p>
            </div>

            <NavLink 
              to="/clubhead/dashboard" 
              className="flex items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <LayoutDashboard size={18} className="mr-3 text-gray-600" />
              Dashboard
            </NavLink>

            <NavLink 
              to="/clubhead/theme" 
              className="flex items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Palette size={18} className="mr-3 text-gray-600" />
              Themes
            </NavLink>

            <button 
              onClick={() => {
                handleLogout();
                setIsDropdownOpen(false);
              }} 
              className="flex items-center w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClubheadNavbar;