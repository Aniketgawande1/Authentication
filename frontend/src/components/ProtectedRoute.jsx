// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { currentUser, loading } = useAuth();

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   if (!currentUser) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// export default function ProtectedRoute({ children }) {
//   const { currentUser, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return currentUser ? children : <Navigate to="/login" />;
// }
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Updated import path

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}