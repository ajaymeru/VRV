import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './adminDashboard/AdminDashboard.jsx';
import AdminLogin from './verification/AdminLogin.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route path="/*" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
