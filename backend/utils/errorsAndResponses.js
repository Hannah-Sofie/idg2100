// Custom error class for handling validation errors
class ValidationError extends Error {
  constructor(message, details = []) {
    super(message); // Passes the message to the Error class constructor
    this.name = "ValidationError"; // Identifies the error type
    this.statusCode = 400; // HTTP status code for client errors
    this.details = details; // Additional details about the validation errors
  }
}

// Custom error class for handling cases where a resource is not found
class NotFoundError extends Error {
  constructor(resource = "Resource") {
    super(`${resource} not found`); // Constructs the error message
    this.name = "NotFoundError"; // Identifies the error type
    this.statusCode = 404; // HTTP status code for not found errors
  }
}

// Utility function to send standardized responses
const sendResponse = (res, statusCode, success, data, message) => {
  // Constructs and sends a JSON response with a common structure
  res.status(statusCode).json({ success, data, message });
};

// Centralized error handling function
const handleError = (res, error) => {
  // Logs detailed error in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("Detailed Error: ", error);
  } else {
    // Logs only the error message in production for security
    console.error("Error: ", error.message);
  }

  // Extracts or defaults the status code, then sends a structured error response
  const statusCode = error.statusCode || 500; // Defaults to 500 if no statusCode is provided
  const errorMessage = error.message || "An unexpected error occurred.";
  const errorResponse = {
    success: false,
    error: {
      name: error.name, // Error type
      message: errorMessage, // Error message
      ...(error.details && { details: error.details }), // Includes details if available
    },
  };

  // Sends the constructed error response
  res.status(statusCode).json(errorResponse);
};

// Exports the utilities and custom error classes for use elsewhere in the application
module.exports = { sendResponse, handleError, ValidationError, NotFoundError };
