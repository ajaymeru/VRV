import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Overview from './pages/Overview.jsx';
import Users from './pages/Users.jsx';
import AddUser from './pages/AddUser.jsx';
import Settings from './pages/Settings.jsx';
import "./AdminDashboard.scss";
import UserDetails from './pages/UserDetails.jsx';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="admin-dashboard">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<Users />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
