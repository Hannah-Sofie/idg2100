const mongoose = require("mongoose");

const assessmentCardSchema = new mongoose.Schema({
  "card-id": Number,
  "card-type": String,
  "card-category": String,
  "card-name": String,
  "card-description": String,
  "card-details": String,
  "card-icon": { 
    type: String,
    default: function() {
      // Replace spaces with hyphens in the category name
      const categoryName = this["card-category"].replace(/\s+/g, '-');
      return `./img/${categoryName}.svg`; 
    }
  }
});

const missionCardSchema = new mongoose.Schema({
  "card-id": Number,
  "card-type": String,
  "card-name": String,
  "card-description": String,
});

exports.AssessmentCard = mongoose.model("AssessmentCard", assessmentCardSchema);
exports.MissionCard = mongoose.model("MissionCard", missionCardSchema);