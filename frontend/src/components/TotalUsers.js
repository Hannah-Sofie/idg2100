import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import "../styles/TotalUsers.css";

/**
 * A component to display the total number of users.
 * It fetches the count of users from the backend upon component mount
 * and updates the state to reflect the total number of users.
 */
function TotalUsers() {
  const [totalUsers, setTotalUsers] = useState(0); // State to hold the total number of users

  useEffect(() => {
    // Fetches the total number of users when the component mounts
    const fetchTotalUsers = async () => {
      try {
        const response = await axiosInstance.get("api/users/count"); // API call to get the count
        setTotalUsers(response.data.data.totalUsers); // Updates state with the fetched count
      } catch (error) {
        console.error("Failed to fetch total number of users:", error);
      }
    };

    fetchTotalUsers(); // Invoke the fetch operation
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="dashboard-stat">
      <h2>Total Users:</h2>
      <div className="total-users">{totalUsers}</div>{" "}
    </div>
  );
}

export default TotalUsers;
