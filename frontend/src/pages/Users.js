import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import UserList from "../components/UserList";
import "../styles/Users.css";

// Component for managing the list of users including their roles and actions like delete or update
const UsersManagement = () => {
  // State hooks for managing users, editing user info, and loading status
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetches the list of users from the backend
  const fetchUsers = useCallback(async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data.data); // Update state with fetched users
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handles deleting a user from the list
  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Update state to remove the user
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initiates editing a user's role
  const handleStartEdit = (userId, role) => {
    setEditingUserId(userId);
    setNewRole(role);
  };

  // Handles updating the role of a user
  const handleRoleUpdate = async () => {
    if (!newRole || !editingUserId) {
      toast.error("Invalid role or user not selected for editing.");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.put(`/api/users/${editingUserId}`, { role: newRole });
      setUsers(
        users.map((user) =>
          user._id === editingUserId ? { ...user, role: newRole } : user
        )
      ); // Update user role in the state
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role.");
    } finally {
      setEditingUserId(null); // Reset editing state
      setNewRole(""); // Reset role selection
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="users-management">
      <h1>Users Management</h1>
      {isLoading ? (
        <p>Loading...</p> // Display a loading text when fetching or updating users
      ) : (
        <UserList
          users={users}
          onDelete={handleDelete}
          onStartEdit={handleStartEdit}
          editingUserId={editingUserId}
          newRole={newRole}
          setNewRole={setNewRole}
          handleRoleUpdate={handleRoleUpdate}
        />
      )}
    </div>
  );
};

export default UsersManagement;
