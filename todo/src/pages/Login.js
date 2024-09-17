import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';  // Import AuthContext

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // Access the login function

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('https://todo-activity-3vta.onrender.com/api/users/login', { email, password });
      console.log('Response:', res.data); // Log the response for debugging
  
      if (res.data.message === 'Login successful!') {
        login(res.data.user.username); // Update login state with username
        navigate('/profile'); // Redirect to Profile page
      } else {
        setMessage(res.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setMessage('Error logging in. Please try again.');
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300"
          >
            Login
          </button>
          {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
