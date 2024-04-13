// Parts of this code is from Sebastian Haugen oblig 2
require("dotenv").config();
const mongoose = require("mongoose");
const data = require("./data/cardData.json");
const { AssessmentCard, MissionCard } = require("./models/cardSchema.js");
const connectDB = require("./config/dbconnect.js");

connectDB();

async function insertAssessmentCard() {
  try {
    for (const card of data["Assessment cards"]) {
      const newCard = new AssessmentCard({
        "card-id": card["card-id"],
        "card-type": card["card-type"],
        "card-category": card["card-category"],
        "card-name": card["card-name"],
        "card-description": card["card-description"],
        "card-details": card["card-details"],
      });

      await newCard.save();
    }
  } catch (err) {
    console.log(`Error inserting cards: ${err}`);
  }
}

async function insertMissionCard() {
  try {
    for (const card of data["Missions"]) {
      const newCard = new MissionCard({
        "card-id": card["card-id"],
        "card-type": card["card-type"],
        "card-name": card["card-name"],
        "card-description": card["card-description"],
      });

      await newCard.save();
    }
  } catch (err) {
    console.log(`Error inserting cards: ${err}`);
  }
}

async function populateDB() {
  try {
    await insertAssessmentCard();
    await insertMissionCard();
    console.log("Cards inserted successfully");
  } catch (err) {
    console.log(`Error inserting cards: ${err}`);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

populateDB();
