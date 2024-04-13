const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to verify if the user is authenticated.
 * It checks for an authentication token in the request cookies.
 * If the token is valid, it attaches the user object to the request and allows to proceed.
 */
const auth = async (req, res, next) => {
  const token = req.cookies["authToken"];
  if (!token) {
    // Respond with an error if no authentication token is found.
    return res.status(401).json({
      error: "Access Denied. No authentication token provided. Please log in.",
    });
  }

  try {
    // Verify the token using the secret and attach user data (excluding password) to request object.
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = await User.findById(verified._id).select("-password");
    next(); // Proceed to the next middleware or request handler.
  } catch (err) {
    // Handle cases with invalid or expired tokens.
    return res
      .status(400)
      .json({ error: "Invalid Token. Please log in again." });
  }
};

/**
 * Middleware to check if the user has one of the allowed roles.
 * @param {Array} allowedRoles - Roles that are permitted to access the route.
 */
const authRole = (allowedRoles) => (req, res, next) => {
  const userRoleLowerCase = req.user.role.toLowerCase();
  const allowedRolesLowerCase = allowedRoles.map((role) => role.toLowerCase());

  // Check if the user's role is in the list of allowed roles.
  if (!allowedRolesLowerCase.includes(userRoleLowerCase)) {
    return res.status(403).json({
      error: `Access denied. This action requires one of the following roles: ${allowedRoles.join(
        ", "
      )}.`,
    });
  }
  next(); // User has an allowed role, proceed to the next middleware or request handler.
};

/**
 * Middleware to check if the logged-in user can update a specific user profile.
 * It allows the operation if the user is updating their own profile or if they are an admin.
 */
const authCanUpdate = async (req, res, next) => {
  // Check if the user is trying to update their own profile or if they are an admin.
  if (
    req.user._id.toString() !== req.params.id &&
    req.user.role.toLowerCase() !== "admin"
  ) {
    // Restrict access if the user is neither the profile owner nor an admin.
    return res.status(403).json({
      error: "Access denied. Only Admins can update.",
    });
  }
  next(); // User is authorized to update the profile, proceed to the next middleware or request handler.
};

module.exports = { auth, authRole, authCanUpdate };
