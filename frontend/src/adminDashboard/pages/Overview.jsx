import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Overview.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserPlus, faUserCheck, faUserXmark } from "@fortawesome/free-solid-svg-icons";

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336'];

const Overview = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersToday, setUsersToday] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  const animateNumber = (start, end, setter) => {
    let current = start;
    const increment = Math.ceil((end - start) / 100);
    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(interval);
        setter(end);
        return;
      }
      setter(current);
    }, 10);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`${import.meta.env.VITE_BASICURL}/auth/user-statistics`, { headers });

        const { totalUsers, usersRegisteredToday, activeUsers, inactiveUsers } = response.data;

        animateNumber(0, totalUsers, setTotalUsers);
        animateNumber(0, usersRegisteredToday, setUsersToday);
        animateNumber(0, activeUsers, setActiveUsers);
        animateNumber(0, inactiveUsers, setInactiveUsers);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Total Users', value: totalUsers },
    { name: 'Users Today', value: usersToday },
    { name: 'Active Users', value: activeUsers },
    { name: 'Inactive Users', value: inactiveUsers },
  ];

  return (
    <div className="overview-container">
      <div className="overview">
        <div className="box">
          <h3>Total Users</h3>
          <div className="iconnum" style={{ color: "#4CAF50", }}>
            <FontAwesomeIcon icon={faUsers} fade />
            <p className="number">{totalUsers}</p>
          </div>
        </div>
        <div className="box">
          <h3>New Users Today</h3>
          <div className="iconnum" style={{ color: "#2196F3", }}>
            <FontAwesomeIcon icon={faUserPlus} fade />
            <p className="number">{usersToday}</p>
          </div>
        </div>
        <div className="box">
          <h3>Active Users</h3>
          <div className="iconnum" style={{ color: "#FF9800", }}>
            <FontAwesomeIcon icon={faUserCheck} fade />
            <p className="number">{activeUsers}</p>
          </div>
        </div>
        <div className="box">
          <h3>Inactive Users</h3>
          <div className="iconnum" style={{ color: "#F44336", }}>
            <FontAwesomeIcon icon={faUserXmark} fade />
            <p className="number">{inactiveUsers}</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>User Statistics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
