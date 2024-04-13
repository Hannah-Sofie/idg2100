const express = require("express");
const router = express.Router();

// Importing authentication and authorization middleware
const { auth, authRole, authCanUpdate } = require("../middleware/verifyToken");

// Importing user controller functions
const {
  getTotalUsers,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/count", auth, getTotalUsers); // Protected route, accessible to authenticated users

router.get("/", auth, authRole(["admin"]), getAllUsers); // Protected route, accessible to authenticated users
router.get("/:id", auth, authRole(["admin"]), getUser); // Protected route, accessible to authenticated users
router.put("/:id", auth, authCanUpdate, updateUser); // Protected route, additional checks for updating
router.delete("/:id", auth, authRole(["admin"]), deleteUser); // Admin only

module.exports = router;
