import React from "react";
import TotalUsers from "../components/TotalUsers";
import "../styles/Dashboard.css";
import StatsCard from "../components/cardTypes/StatsCard";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <TotalUsers />
      <StatsCard />
    </div>
  );
}

export default Dashboard;
