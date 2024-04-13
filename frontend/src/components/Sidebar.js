import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Logo from "../assets/img/logo.png";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Invoke the logout method from AuthContext
      navigate("/login"); // Redirect to the login page after successful logout
      toast.success("Successfully logged out.");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="container-sidebar">
        <nav>
          <ul>
            <li className="logo-item">
              <Link to="/dashboard" className="logo">
                <img src={Logo} alt="Logo" />
                <span className="nav-item">SUPER Assessor</span>
              </Link>
            </li>

            <li className="nav-link-item">
              <Link to="/dashboard">
                <i className="fas fa-home"></i>
                <span className="nav-item">Dashboard</span>
              </Link>
            </li>

            <li className="nav-link-item">
              <Link to="/cards-management">
                <i className="fas fa-tasks"></i>
                <span className="nav-item">Cards Management</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/users-management">
                <i className="fas fa-users"></i>
                <span className="nav-item">Users Management</span>
              </Link>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="logout">
                <i className="fas fa-sign-out-alt"></i>
                <span className="nav-item">Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
