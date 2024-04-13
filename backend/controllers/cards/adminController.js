const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { AssessmentCard, MissionCard } = require("../../models/cardSchema");

// Initialize the router
const router = express.Router();
// Use the express.json() middleware after initializing the router
router.use(express.json());

// Multer will save the uploaded files to a new folder called uploads
const upload = multer({ dest: "uploads/" });

// DELETE a card
const deleteCard = async (req, res) => {
  const cardId = req.params.cardId; // Get card ID from URL parameters

  try {
    const assessmentDeleteResult = await AssessmentCard.deleteOne({
      "card-id": cardId,
    });
    const missionDeleteResult = await MissionCard.deleteOne({
      "card-id": cardId,
    });

    if (
      assessmentDeleteResult.deletedCount === 0 &&
      missionDeleteResult.deletedCount === 0
    ) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting card from database" });
  }
};

// Update a card
const updateCard = async (req, res) => {
  const cardId = req.params.cardId; // Get card ID from URL parameters
  const cardData = req.body; // Get updated card data from request body

  try {
    let updateResult;
    if (cardData["card-type"] === "assessment") {
      updateResult = await AssessmentCard.updateOne(
        { "card-id": cardId },
        cardData
      );
    } else {
      updateResult = await MissionCard.updateOne(
        { "card-id": cardId },
        cardData
      );
    }

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ message: "Card updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating card in database" });
  }
};

// For uploading JSON data directly in the request body
const uploadJson = async (req, res) => {
  const data = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));

  // Loop through the data and save each card to the database
  // Another issue is that the json array has to be called cards
  for (const card of data.cards) {
    try {
      let newCard;
      if (card["card-type"] === "assessment") {
        newCard = new AssessmentCard({
          "card-id": card["card-id"],
          "card-type": card["card-type"],
          "card-category": card["card-category"],
          "card-name": card["card-name"],
          "card-description": card["card-description"],
          "card-details": card["card-details"],
        });
      } else {
        newCard = new MissionCard({
          "card-id": card["card-id"],
          "card-type": card["card-type"],
          "card-name": card["card-name"],
          "card-description": card["card-description"],
        });
      }

      // Save the card to the database
      await newCard.save();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error saving card to database" });
    }
  }

  res.status(200).json({ message: "Cards uploaded successfully" });
};

// For uploading a new icon to the API will be saved in the uploads folder that multer creates
// Little bit of an issue is that the category has to match DB which is case sensitive
// so you have to type "http://localhost:8001/api/cards/upload/upload-icon/Who is assessed"
// with the spaces and capital first letter for it to work
const uploadIcon = async (req, res) => {
  try {
    // Sets the new icons file name to the same as the card category
    // It's a little annoying but it works
    const category = req.params.category;
    const oldPath = req.file.path;
    const newPath = path.join(
      __dirname,
      "../../",
      "uploads",
      `${category}.svg`
    );

    // Rename the file to the category name
    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error renaming file: ${err.message}` });
      }

      // The code will change the file paths in the database to the new path for all
      // cards with the same category. For example if "Context" is the category, all cards
      // with the category "Context" will have their icon path changed to the new path of the
      // new icon
      try {
        await AssessmentCard.updateMany(
          { "card-category": category },
          { "card-icon": newPath }
        );
        res.sendFile(newPath);
      } catch (err) {
        res
          .status(500)
          .json({ error: `Error updating icon path: ${err.message}` });
      }
    });
  } catch (err) {
    res.status(500).json({ error: `Error changing icon: ${err.message}` });
  }
};

const placeHolderIcon = async (req, res) => {
  const { category } = req.params;
  // Adjust the path to go up two levels from the current directory
  const placeholderDir = path.join(__dirname, "../../img/");

  const categoryToFile = {
    // Make sure the category names here exactly match what you're expecting in the request
    "Who is assessed": "who-is-assessed.svg",
    "The assessor": "the-assessor.svg",
    "Assessment artefact": "assessment-artefact.svg",
    "Assessment format": "assessment-format.svg",
    Context: "context.svg", // Assuming the request comes in as just "Context"
    "Assessment timing": "assessment-timing.svg",
  };

  const fileName = categoryToFile[category];
  if (!fileName) {
    console.log(`Placeholder for ${category} not found.`);
    return res.status(404).json({ error: "Icon not found" });
  }

  const placeholderPath = path.join(placeholderDir, fileName);

  console.log(`Attempting to access placeholder at path: ${placeholderPath}`); // Added for debugging

  fs.access(placeholderPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${fileName} not found at path: ${placeholderPath}`); // More detailed log
      return res.status(404).json({ error: "Icon not found" });
    }
    // If the file exists, send it back
    res.sendFile(placeholderPath);
  });
};

// For uploading JSON data directly in the request body
const directJson = async (req, res) => {

  // Assuming the JSON structure is similar and has a top-level "cards" array
  const data = req.body; // Directly use the parsed JSON from the request body

  // Loop through the data.cards array and save each card to the database
  if (data.cards && Array.isArray(data.cards)) {
    try {
      for (const card of data.cards) {
        let newCard;
        if (card["card-type"] === "assessment") {
          newCard = new AssessmentCard({
            "card-id": card["card-id"],
            "card-type": card["card-type"],
            "card-category": card["card-category"],
            "card-name": card["card-name"],
            "card-description": card["card-description"],
            "card-details": card["card-details"],
          });
        } else {
          newCard = new MissionCard({
            "card-id": card["card-id"],
            "card-type": card["card-type"],
            "card-name": card["card-name"],
            "card-description": card["card-description"],
          });
        }
        await newCard.save(); // Save the card to the database
      }
      res.status(200).json({ message: "Cards uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error saving card to database" });
    }
  } else {
    res.status(400).json({ error: "Invalid JSON structure" });
  }
};

module.exports = {
  uploadJson,
  uploadIcon,
  updateCard,
  deleteCard,
  placeHolderIcon,
  directJson,
};
