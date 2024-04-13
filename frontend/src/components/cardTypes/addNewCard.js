import React, { useState, useEffect } from "react";
import "./styles/createCard.css";

function CardForm() {
  const [cardData, setCardData] = useState({
    "card-id": "",
    "card-type": "",
    "card-category": "",
    "card-name": "",
    "card-description": "",
    "card-details": "",
  });

  useEffect(() => {
    if (cardData["card-type"] === "assessment") {
      setCardData((prevState) => ({
        ...prevState,
        "card-category": "",
        "card-description": "",
        "card-details": "",
      }));
    } else if (cardData["card-type"] === "mission") {
      setCardData((prevState) => ({
        ...prevState,
        "card-category": "",
        "card-description": "",
        "card-name": "",
      }));
    }
  }, [cardData["card-type"]]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { cards: [cardData] };

    try {
      const response = await fetch(
        "http://localhost:8001/api/cards/upload/direct-json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert("Card uploaded successfully!");
      } else {
        throw new Error("Failed to upload card");
      }
    } catch (error) {
      console.error("Error uploading card:", error);
      alert("Error uploading card. Check console for details.");
    }
  };

  return (
    <div className="formWrapper">
      <h2>Create New Card</h2>
      <div className="formContent">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Card ID</label>
            <input
              type="text"
              name="card-id"
              value={cardData["card-id"]}
              onChange={handleChange}
              placeholder="Card ID"
              required
            />
          </div>
          <div>
            <label>Card Type</label>
            <select
              name="card-type"
              value={cardData["card-type"]}
              onChange={handleChange}
              required
            >
              <option value="">Select Card Type</option>
              <option value="assessment">Assessment</option>
              <option value="mission">Mission</option>
            </select>
          </div>

          {cardData["card-type"] === "assessment" && (
            <div>
              <label>Assessment Card Category</label>
              <select
                name="card-category"
                value={cardData["card-category"]}
                onChange={handleChange}
                required
              >
                <option value="">Select Assessment Card Category</option>
                <option value="who-is-assessed">Who is assessed</option>
                <option value="the-assessor">The assessor</option>
                <option value="assessment-artefact">Assessment artefact</option>
                <option value="assessment-format">Assessment format</option>
                <option value="context">Context</option>
                <option value="assessment-timing">Assessment timing</option>
              </select>
            </div>
          )}

          {cardData["card-type"] === "mission" && (
            <div>
              <label>Mission Card Category</label>
              <select
                name="card-name"
                value={cardData["card-name"]}
                onChange={handleChange}
                required
              >
                <option value="">Select Mission Card Category</option>
                <option value="Innovation">Innovation</option>
                <option value="time-management">Time management</option>
                <option value="learning">Learning</option>
                <option value="student-engagement">Student engagement</option>
                <option value="authenticity">Authenticity</option>
                <option value="cost-cutting">Cost cutting</option>
                <option value="counteract-cheating">Counteract cheating</option>
              </select>
            </div>
          )}

          <div>
            <label>Card Description</label>
            <input
              type="text"
              name="card-description"
              value={cardData["card-description"]}
              onChange={handleChange}
              placeholder="Card Description"
              required
              maxLength={200}
            />
          </div>

          {cardData["card-type"] === "assessment" && (
            <div>
              <label>Card Details</label>
              <input
                type="text"
                name="card-details"
                value={cardData["card-details"]}
                onChange={handleChange}
                placeholder="Card Details"
                required
                maxLength={200}
              />
            </div>
          )}
          <input type="submit" value="Create card" />
        </form>
      </div>
    </div>
  );
}

export default CardForm;
