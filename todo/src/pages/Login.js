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
      const res = await axios.post('https://todo-8.onrender.com/api/users/login', { email, password });
      console.log('Response:', res.data); // Log the response for debugging
  
      if (res.data.message === 'Login successful!') {
        // Assuming res.data.user contains the username
        login(res.data.user.username);  // Update login state with username
        navigate('/profile');  // Redirect to Profile page
      } else {
        setMessage(res.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Log error details
      console.error('Login error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      setMessage('Error logging in. Please try again.');
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 bg-white rounded-md shadow-md">
        <h1 className="text-xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Email:</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Login
          </button>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
