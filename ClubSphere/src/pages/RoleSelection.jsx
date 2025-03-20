import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 overflow-hidden"></div>
      <div className="relative bg-gray-800 p-8 rounded-lg shadow-md w-96 max-h-full overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
            <img src={logo} alt="ClubSphere Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Select Your Role</h2>
        <div className="flex flex-col space-y-4">
          <button
            className="w-full p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => navigate('/student-login')}
          >
            Student
          </button>
          <button
            className="w-full p-2 bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => navigate('/clubhead-login')}
          >
            Club Head
          </button>
          <button
            className="w-full p-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            onClick={() => navigate('/teacher-login')}
          >
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
