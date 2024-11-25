import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="navbar">
      <h2>Welcome to VRV</h2>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
