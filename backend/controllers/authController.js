const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Utility functions for sending standardized responses and handling errors
const {
  sendResponse,
  handleError,
  ValidationError,
  NotFoundError,
} = require("../utils/errorsAndResponses");

// Registers a new user after validating the request body
const registerUser = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Respond with validation errors if any
      throw new ValidationError(
        "Validation failed",
        errors.array().map((err) => err.msg)
      );
    }

    // Destructure and check if the provided email already exists
    const {
      fullName,
      email,
      password,
      department,
      university,
      position,
      role,
    } = req.body;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      // Prevent registration if email already exists
      throw new ValidationError("Email already exists");
    }

    // Hash password and create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      department,
      university,
      position,
      role,
    });

    // Save the user and respond
    const savedUser = await user.save();
    sendResponse(
      res,
      201,
      true,
      { userId: savedUser._id },
      "User registered successfully"
    );
  } catch (error) {
    // Handle any errors
    handleError(res, error);
  }
};

// Logs in a user by validating credentials and generating a JWT token
const loginUser = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Respond with validation errors if any
      throw new ValidationError(
        "Validation failed",
        errors.array().map((err) => err.msg)
      );
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Handle case where user is not found
      throw new NotFoundError("User not found");
    }

    // Check if password is valid
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      // Respond if password is invalid
      throw new ValidationError("Invalid credentials");
    }

    // Generate and send JWT token in a cookie
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("authToken", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
    });

    // Respond with user details (excluding password)
    sendResponse(
      res,
      200,
      true,
      { id: user._id, name: user.fullName, email: user.email, role: user.role },
      "Logged in successfully"
    );
  } catch (error) {
    // Handle any errors
    handleError(res, error);
  }
};

// Logs out a user by clearing the authentication token cookie
const logoutUser = async (req, res) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie("authToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Respond with success message
    sendResponse(res, 200, true, null, "Logged out successfully");
  } catch (error) {
    // Handle any errors
    handleError(res, error);
  }
};

// Fetches the role of the logged-in user
const getUserRole = async (req, res) => {
  try {
    // Find user by ID from request
    const user = await User.findById(req.user._id);
    if (!user) {
      // Handle case where user is not found
      throw new NotFoundError("", "User");
    }

    // Respond with user role
    sendResponse(
      res,
      200,
      true,
      { userRole: user.role },
      "User role fetched successfully"
    );
  } catch (error) {
    // Handle any errors
    handleError(res, error);
  }
};

// Verifies if a user's token is valid and returns user details
const verifyToken = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies["authToken"];
    if (!token) {
      // Handle missing token
      throw new ValidationError("No token provided");
    }

    // Verify token and find user
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(verified._id);
    if (!user) {
      // Handle case where user is not found
      throw new NotFoundError("User not found");
    }

    // Respond with user details (excluding password)
    sendResponse(
      res,
      200,
      true,
      { id: user._id, name: user.fullName, email: user.email, role: user.role },
      "Token verified successfully"
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Clear token cookie if invalid
      res.clearCookie("authToken", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
    // Handle any errors
    handleError(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserRole,
  verifyToken,
};
