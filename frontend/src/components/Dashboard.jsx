import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser?.name || 'User'}!</h2>
        <p className="text-gray-600">
          You are now logged in. This is a protected dashboard that only authenticated users can see.
        </p>
        
        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-lg mb-2">Your Account Information</h3>
          <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
          <p><strong>User since:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;