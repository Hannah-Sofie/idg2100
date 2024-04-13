import React, { useState } from "react";
import "../fromAssignment1/AssessmentCard.js";
import "../fromAssignment1/MissionCard.js";
import "./gamecss.css";

const CardsGame = () => {
  const [favorites, setFavorites] = useState([]);
  const [randomKey, setRandomKey] = useState(0);

  const addFavorite = (cardId) => {
    if (!favorites.includes(cardId)) {
      setFavorites([...favorites, cardId]);
    }
  };

  const removeFavorite = (cardId) => {
    setFavorites(favorites.filter((id) => id !== cardId));
  };

  const randomizeCards = () => {
    // Update the random key to force a re-render of the web components
    setRandomKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="gameLayout">
      <main>
        <section>
          <h2>Mission Cards (x3)</h2>
          <div className="card-container mission-cards">
            {/* Include the `randomKey` in the `key` prop */}
            {Array.from({ length: 3 }).map((_, index) => (
              <mission-card key={`${randomKey}-${index}`}></mission-card>
            ))}
          </div>
        </section>
        <section>
          <h2>Assessment Cards (x6)</h2>
          <div className="card-container assessment-cards">
            {Array.from({ length: 6 }).map((_, index) => (
              <assessment-card key={`${randomKey}-${index}`}></assessment-card>
            ))}
          </div>
        </section>
      </main>
      <aside>
        <h2>Favourite Cards</h2>
        <ul id="favourite-cards-list">
          {favorites.map((cardId) => (
            <li key={cardId}>
              Card ID: {cardId}
              <button onClick={() => removeFavorite(cardId)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={randomizeCards}>Randomise</button>
      </aside>
    </div>
  );
};

export default CardsGame;
