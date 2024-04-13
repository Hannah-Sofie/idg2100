import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import "../styles/RegisterLogin.css";

/**
 * Register page for new users to create an account.
 * It provides a form for users to input their details, validates the inputs,
 * and submits the registration data to the server.
 */
function Register() {
  // State to hold form data for all fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    position: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission status
  const navigate = useNavigate(); // Hook to programmatically navigate to other routes

  /**
   * Updates the formData state based on form input changes.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Dynamically updates the corresponding form field
    }));
  };

  /**
   * Validates form inputs before submission.
   * Checks for required fields, valid email format, password criteria,
   * and valid selections for role and position.
   */
  const validateForm = () => {
    // Required fields check
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }

    // Email format check using a simple regex pattern for demonstration purposes
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Password length check
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    // Password must contain at least one uppercase letter and one special character
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*]).*$/;
    if (!passwordPattern.test(formData.password)) {
      toast.error(
        "Password must contain at least one uppercase letter and one special character."
      );
      return false;
    }

    // Role selection check
    if (!["admin", "user"].includes(formData.role)) {
      toast.error("Please select a valid role.");
      return false;
    }

    // If all checks pass
    return true;
  };

  /**
   * Handles form submission. Validates inputs and submits the form data
   * to the server if validations pass.
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    if (!validateForm()) return; // Stops the submission if validation fails

    setIsSubmitting(true); // Indicate the start of form submission
    try {
      const response = await axiosInstance.post("/api/auth/register", formData);
      toast.success(response.data.message || "Registered successfully!");
      navigate("/login"); // Redirects user to the login page upon successful registration
    } catch (error) {
      // Handle any errors from the registration attempt
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  return (
    <div className="register-login-wrapper">
      <div className="back-to-home-container">
        <button onClick={() => navigate("/")} className="back-to-home-btn">
          ⬅ Back
        </button>
      </div>
      <div className="register-login-content">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="fullName">Full Name*</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
            />
          </div>
          <div>
            <label htmlFor="position">Position</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">Select Position</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="tA">TA</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="role">Role*</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
