import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.scss";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASICURL}/auth/login`,
        { email, password }
      );

      toast.success(response.data.message, { position: "top-right" });

      setIsConfettiVisible(true);

      localStorage.setItem("token", response.data.token);

      setTimeout(() => {
        setIsConfettiVisible(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response && err.response.data.message
          ? err.response.data.message
          : "Login failed. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      {isConfettiVisible && (
        <Confetti numberOfPieces={300} gravity={0.25} tweenDuration={3000} />
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Admin Login</h2>
        <div className="form-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
        <p style={{ color: "white" }}>
          For login credentials, refer to the &nbsp;
          <a
            style={{
              color: "#4CCEAC",
              textDecoration: "underline" ,
              fontWeight:"600"
            }}
            href="https://github.com/ajaymeru/VRV"
            onMouseOver={(e) => e.target.style.color = "white"}
            onMouseOut={(e) => e.target.style.color = "#4CCEAC"}
          >
            Readme.md
          </a>.
        </p>

      </form>
    </div>
  );
};

export default AdminLogin;
