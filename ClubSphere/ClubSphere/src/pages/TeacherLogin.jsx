import React, { useState } from "react";
import logo from '../assets/logo.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const TeacherLogin = () => {
  const [ID, setID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://import.meta.env.VITE_BACKEND_URL:3000/api/teachers/login', {
        ID,
        password,
      });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/teacher');
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data.error);
        alert(error.response.data.error);
      } else if (error.request) {
        console.error('No response from server:', error.request);
        alert('Unable to connect to the server');
      } else {
        console.error('Error:', error.message);
        alert('An error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 overflow-hidden"></div>
      <div className="relative bg-gray-800 p-8 rounded-lg shadow-md w-96 max-h-full overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
            <img src={logo} alt="ClubSphere Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Teacher Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">ID</label>
            <input
              type="text"
              value={ID}
              onChange={(e) => setID(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1 bg-gray-700 text-white border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1 bg-gray-700 text-white border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;