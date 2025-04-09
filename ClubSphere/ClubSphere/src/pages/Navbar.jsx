import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  Upload, 
  LayoutDashboard, 
  Palette,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import logo from "../assets/logo.png";
import { useThemeStore } from "../store/useThemeStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { THEMES } from "../constants";

const Navbar = () => {
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isDarkMode = theme === "dark";

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
    <div className={`${isDarkMode ? 'bg-gray-900 text-white border-b border-gray-800' : 'bg-white text-gray-900 border-b border-gray-100'} sticky top-0 z-50 transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <img src={logo} alt="ClubSphere Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">ClubSphere</span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="ClubSphere Logo" className="h-10 w-10" />
          <span className="text-xl font-bold">ClubSphere</span>
        </div>

        {/* Center: Main Navigation */}
        <div className="flex items-center justify-center space-x-2">
          <NavLink
            to="/student"
            className={({ isActive }) => `p-3 relative rounded-lg transition-colors group ${
              isActive 
                ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            end
          >
            {({ isActive }) => (
              <>
                <Home size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Home
                </span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/student/clubs"
            className={({ isActive }) => `p-3 relative rounded-lg transition-colors group ${
              isActive 
                ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {({ isActive }) => (
              <>
                <Users size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Clubs
                </span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/student/proof"
            className={({ isActive }) => `p-3 relative rounded-lg transition-colors group ${
              isActive 
                ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {({ isActive }) => (
              <>
                <Upload size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Upload
                </span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>
        </div>

        {/* Right: User Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors group relative ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Palette size={20} />
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Theme
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-inner">
                {rollNo?.slice(-2) || "??"}
              </div>
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium">{rollNo || "Loading..."}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                </div>
                
                <div className="p-2">
                  <NavLink 
                    to="/student/dashboard" 
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } transition-colors ${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : ''}`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left ${
                      isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
                    } transition-colors mt-2`}
                  >
                    <LogOut size={18} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around items-center py-2">
          <NavLink
            to="/student"
            className={({ isActive }) => `p-2 flex flex-col items-center ${
              isActive ? isDarkMode ? 'text-blue-400' : 'text-blue-600' : ''
            }`}
            end
          >
            {({ isActive }) => (
              <>
                <Home size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-xs mt-1">Home</span>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/student/clubs"
            className={({ isActive }) => `p-2 flex flex-col items-center ${
              isActive ? isDarkMode ? 'text-blue-400' : 'text-blue-600' : ''
            }`}
          >
            {({ isActive }) => (
              <>
                <Users size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-xs mt-1">Clubs</span>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/student/proof"
            className={({ isActive }) => `p-2 flex flex-col items-center ${
              isActive ? isDarkMode ? 'text-blue-400' : 'text-blue-600' : ''
            }`}
          >
            {({ isActive }) => (
              <>
                <Upload size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-xs mt-1">Upload</span>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) => `p-2 flex flex-col items-center ${
              isActive ? isDarkMode ? 'text-blue-400' : 'text-blue-600' : ''
            }`}
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-xs mt-1">Dashboard</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
      
      {/* Mobile Side Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className={`absolute top-0 left-0 bottom-0 w-3/4 max-w-xs ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } border-r ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-inner">
                  {rollNo?.slice(-2) || "??"}
                </div>
                <div>
                  <p className="font-medium">{rollNo || "Loading..."}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <NavLink 
                to="/student" 
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive
                    ? isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                end
              >
                <Home size={20} />
                <span>Home</span>
              </NavLink>
              
              <NavLink 
                to="/student/clubs" 
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive
                    ? isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users size={20} />
                <span>Clubs</span>
              </NavLink>
              
              <NavLink 
                to="/student/proof" 
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive
                    ? isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Upload size={20} />
                <span>Upload</span>
              </NavLink>
              
              <NavLink 
                to="/student/dashboard" 
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${
                  isActive
                    ? isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
              
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 px-3 py-2 rounded-md w-full ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <Palette size={20} />
                <span>Toggle Theme</span>
              </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md w-full ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
              >
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;