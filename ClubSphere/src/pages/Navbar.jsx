import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
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
  const location = useLocation();
  const isOnClubsPage = location.pathname === "/student/clubs";
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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

      <div>
        <NavLink
          to={isOnClubsPage ? "/student" : "/student/clubs"}
          className={({ isActive }) => `text-lg mx-4 ${isActive ? "text-blue-400" : "text-white"}`}
        >
          {isOnClubsPage ? "Feed" : "Clubs"}
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="btn btn-sm btn-outline text-white">
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
        <NavLink to="/student/dashboard">
          <FaUserCircle className="text-3xl cursor-pointer hover:text-blue-400" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
