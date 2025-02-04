import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="ClubSphere Logo" className="h-10 w-10 mr-2" />
        <span className="text-xl font-semibold">ClubSphere</span>
      </div>
      
      <div>
        <NavLink
          to="/clubs"
          className={({ isActive }) => `text-lg mx-4 ${isActive ? 'text-blue-400' : 'text-white'}`}
        >
          Clubs
        </NavLink>
      </div>
      
      {/* User Icon */}
      <div>
        <NavLink to="/dashboard">
          <FaUserCircle className="text-3xl cursor-pointer hover:text-blue-400" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
