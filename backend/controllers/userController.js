const User = require("../models/User");
const {
  sendResponse,
  handleError,
  NotFoundError,
} = require("../utils/errorsAndResponses");

// Retrieves and returns the total count of users in the database.
const getTotalUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    // Utilizes a utility function to send a standardized success response.
    sendResponse(
      res,
      200,
      true,
      { totalUsers: userCount },
      "Total users count fetched successfully."
    );
  } catch (error) {
    // Centralizes error handling through a utility function.
    handleError(res, error);
  }
};

// Fetches a list of all users, excluding their passwords, from the database.
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excludes passwords from the result set for security.
    sendResponse(res, 200, true, users, "All users fetched successfully.");
  } catch (error) {
    handleError(res, error);
  }
};

// Retrieves a single user by their ID, excluding the password, and returns their details.
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      // If no user is found, a NotFoundError is thrown to indicate the error.
      throw new NotFoundError("User", "Ensure the ID is correct.");
    }
    sendResponse(res, 200, true, user, "User details fetched successfully.");
  } catch (error) {
    handleError(res, error);
  }
};

// Updates user details for a specific user ID and returns the updated user information.
const updateUser = async (req, res) => {
  try {
    // Attempts to update the user and return the new document.
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    if (!user) {
      // Checks if the user exists; if not, throws an error.
      throw new NotFoundError(
        "User",
        "Verify the user ID. Only existing users can be updated."
      );
    }
    sendResponse(res, 200, true, user, "User updated successfully.");
  } catch (error) {
    handleError(res, error);
  }
};

// Deletes a user by their ID and confirms the deletion.
const deleteUser = async (req, res) => {
  try {
    // Performs the deletion operation based on the user's ID.
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      // If no document was deleted, it implies the ID was incorrect or the user was already deleted.
      throw new NotFoundError(
        "User",
        "User ID may be incorrect or the user might have already been deleted."
      );
    }
    sendResponse(res, 200, true, null, "User deleted successfully.");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getTotalUsers,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
