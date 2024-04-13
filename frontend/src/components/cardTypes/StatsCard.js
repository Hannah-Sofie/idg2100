import React, { useState, useEffect } from "react";
import "./styles/createCard.css";

function StatsCard() {
  const [cardData, setCardData] = useState({
    "card-id": "",
    "card-type": "",
    "card-category": "",
    "card-name": "",
    "card-description": "",
    "card-details": "",
  });

  const [stats, setStats] = useState(null); // State to hold the statistics
  const [totalAssessmentCards, setTotalAssessmentCards] = useState(0);
  const [totalMissionCards, setTotalMissionCards] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const assessmentResponse = await fetch(
          "http://127.0.0.1:8001/api/cards/assessment",
        );
        if (!assessmentResponse.ok)
          throw new Error("Failed to fetch assessment cards");
        const assessmentData = await assessmentResponse.json();
        setTotalAssessmentCards(assessmentData.length);

        const missionResponse = await fetch(
          "http://127.0.0.1:8001/api/cards/mission",
        );
        if (!missionResponse.ok)
          throw new Error("Failed to fetch mission cards");
        const missionData = await missionResponse.json();
        setTotalMissionCards(missionData.length);
      } catch (error) {
        console.error("Error fetching card totals:", error);
      }
    };

    fetchTotals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `http://127.0.0.1:8001/api/cards/${cardData["card-type"]}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch cards data");

      let data = await response.json();

      if (
        cardData["card-type"] === "assessment" &&
        cardData["card-category"] &&
        cardData["card-category"] !== ""
      ) {
        data = data.filter(
          (card) => card["card-category"] === cardData["card-category"],
        );
      } else if (
        cardData["card-type"] === "mission" &&
        cardData["card-name"] &&
        cardData["card-name"] !== ""
      ) {
        data = data.filter(
          (card) => card["card-name"] === cardData["card-name"],
        );
      }

      const categoryCounts = data.reduce((acc, card) => {
        const key =
          cardData["card-type"] === "assessment"
            ? card["card-category"]
            : card["card-name"];
        const category = key || "Uncategorized";
        acc[category] = acc[category] ? acc[category] + 1 : 1;
        return acc;
      }, {});

      setStats(categoryCounts);
    } catch (error) {
      console.error("Error fetching card data:", error);
      alert("Error fetching card data. Check console for details.");
    }
  };

  return (
    <div className="formWrapper">
      <h2>Card Statistics</h2>
      <div>
        <p>Total number of assessment cards: {totalAssessmentCards}</p>
        <p>Total number of mission cards: {totalMissionCards}</p>
      </div>

      <div className="formContent">
        <p>Use the form below to get statistics on card categories</p>
        <form onSubmit={handleSubmit}>
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
              >
                <option value="">Show all results for assessment</option>
                <option value="Who is assessed">Who is assessed</option>
                <option value="The assessor">The assessor</option>
                <option value="Assessment artefact">Assessment artefact</option>
                <option value="Assessment format">Assessment format</option>
                <option value="Context">Context</option>
                <option value="Assessment timing">Assessment timing</option>
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
              >
                <option value="">Show all results for Mission</option>
                <option value="Innovation">Innovation</option>
                <option value="Time management">Time management</option>
                <option value="Learning">Learning</option>
                <option value="Student engagement">Student engagement</option>
                <option value="Authenticity">Authenticity</option>
                <option value="Cost cutting">Cost cutting</option>
                <option value="Counteract cheating">Counteract cheating</option>
              </select>
            </div>
          )}

          <input type="submit" value="Show info" />
        </form>
        {stats && (
          <div>
            <h3>Statistics</h3>
            {Object.entries(stats).map(([category, count]) => (
              <p key={category}>
                {category}: {count}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
