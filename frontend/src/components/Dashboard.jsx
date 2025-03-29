// import React from 'react';
// import { useAuth } from '../AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="max-w-4xl w-full mx-auto bg-white shadow-md rounded-lg p-6">
//       <div className="flex justify-between items-center border-b pb-4">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Log Out
//         </button>
//       </div>
      
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser?.name || 'User'}!</h2>
//         <p className="text-gray-600">
//           You are now logged in. This is a protected dashboard that only authenticated users can see.
//         </p>
        
//         <div className="mt-8 bg-gray-50 p-4 rounded-md">
//           <h3 className="font-medium text-lg mb-2">Your Account Information</h3>
//           <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
//           <p><strong>User since:</strong> {new Date().toLocaleDateString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
            <div className="ml-6 flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.name || 'User'}!</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Your Account Information</h3>
                    <div className="mt-5 border-t border-gray-200 pt-5">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Full name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser?.name || 'Not provided'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Email address</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentUser?.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Account created</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(currentUser?.createdAt).toLocaleDateString()}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;