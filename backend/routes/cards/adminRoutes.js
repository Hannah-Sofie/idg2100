const express = require("express");
// Initialize the router
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// const { auth, authRole } = require("../../middleware/verifyToken");
const {
  uploadJson,
  uploadIcon,
  updateCard,
  deleteCard,
  placeHolderIcon,
  directJson,
} = require("../../controllers/cards/adminController.js");

// Use the express.json() middleware after initializing the router
router.use(express.json());

// DELETE a card
// We would use , auth and authRole(["admin"]) to protect the route
// but we dont have the cookies set up yet
router.delete("/deleteCard/:cardId", deleteCard);

// Update a card
// We would use , auth and authRole(["admin"]) to protect the route
// but we dont have the cookies set up yet
router.put("/updateCard/:cardId", updateCard);

// For uploading JSON data directly in the request body
// We would use , auth and authRole(["admin"]) to protect the route
// but we dont have the cookies set up yet
router.post("/upload-json", upload.single("cards"), uploadJson);

router.post("/direct-json", directJson);

// For uploading a new icon to the API will be saved in the uploads folder that multer creates
// Little bit of an issue is that the category has to match DB which is case sensitive
// so you have to type "http://localhost:8001/api/cards/upload/upload-icon/Who is assessed"
// with the spaces and capital first letter for it to work

// http://localhost:8001/api/cards/placeholders/Who is assessed
// Placeholder icon endpoint
// We would use , auth and authRole(["admin"]) to protect the route
// but we dont have the cookies set up yet
router.get("/icons/placeholders/:category", placeHolderIcon);
router.post("/upload-icon/:category", upload.single("icon"), uploadIcon);

module.exports = router;
