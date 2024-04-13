import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../styles/RegisterLogin.css";

/**
 * The Login component provides a user interface for authentication.
 * It allows users to enter their email and password to log into the application.
 */
function Login() {
  const [email, setEmail] = useState(""); // State for the email input
  const [password, setPassword] = useState(""); // State for the password input
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status during login attempt
  const auth = useAuth(); // Access the authentication context
  const navigate = useNavigate(); // Hook for programmatically navigating

  /**
   * Updates state based on input field changes. It handles changes for both
   * email and password inputs.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  /**
   * Validates the input fields before submitting the login form.
   * It checks for empty fields and validates the email format.
   */
  const validateInputs = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  /**
   * Handles the submission of the login form. It validates inputs and then
   * uses the authentication context to attempt logging in.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return; // Stops the login attempt if validation fails

    setIsLoading(true); // Indicates the start of the login process
    try {
      await auth.login({ email, password }); // Attempts to log in with provided credentials
      toast.success("Logged in successfully.");
      navigate("/dashboard"); // Navigates to the dashboard upon successful login
    } catch (error) {
      // Handles any login errors
      toast.error(
        "Login failed. Please check if your email or password is correct."
      );
    } finally {
      setIsLoading(false); // Resets the loading state regardless of login outcome
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
