import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaPlus, FaCog, FaTachometerAlt } from 'react-icons/fa';
import "./Sidebar.scss"
import logo from "../../assets/logo.png"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="top-section">
        {isOpen && <img src={logo} alt="Logo" className="logo" />}
        <button className="hamburger" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className="menu">
        <li>
          <Link to="/">
            <FaTachometerAlt />
            {isOpen && <span>Overview</span>}
          </Link>
        </li>
        <li>
          <Link to="/users">
            <FaUser />
            {isOpen && <span>Users</span>}
          </Link>
        </li>
        <li>
          <Link to="/add-user">
            <FaPlus />
            {isOpen && <span>Add User</span>}
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <FaCog />
            {isOpen && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
