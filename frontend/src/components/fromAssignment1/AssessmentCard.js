class AssessmentCard extends HTMLElement {
  static get observedAttributes() {
    return ["card-id", "card-category", "card-name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.cardId = "";
    this.cardsData = [];
  }

  connectedCallback() {
    this.fetchRandomCardData();
  }

  refreshData() {
    this.filterAndDisplayCard();
  }

  async fetchRandomCardData() {
    try {
      const response = await fetch(
        "http://localhost:8001/api/cards/assessment",
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      this.cardsData = jsonData;
      this.filterAndDisplayCard();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.filterAndDisplayCard();
    }
  }

  filterAndDisplayCard() {
    let filteredData = this.cardsData;

    const cardId = this.getAttribute("card-id");
    const cardCategory = this.getAttribute("card-category");
    const cardName = this.getAttribute("card-name");

    if (cardId) {
      const numericCardId = Number(cardId);
      filteredData = filteredData.filter(
        (card) => card["card-id"] === numericCardId,
      );
    } else if (cardCategory) {
      filteredData = filteredData.filter(
        (card) => card["card-category"] === cardCategory,
      );
    } else if (cardName) {
      filteredData = filteredData.filter(
        (card) => card["card-name"] === cardName,
      );
    }

    if (filteredData.length > 0) {
      const randomCard =
        filteredData[Math.floor(Math.random() * filteredData.length)];
      this.render(randomCard);
    }
  }

  render(cardData) {
    const {
      "card-id": cardId,
      "card-category": cardCategory,
      "card-name": cardName,
      "card-description": cardDescription,
      "card-details": cardDetails,
    } = cardData;

    const categoryColors = {
      "Who is assessed": "#005777",
      "The assessor": "#7D5EA5",
      "Assessment artefact": "#D11F44",
      "Assessment format": "#91CD90",
      Context: "#F17299",
      "Assessment timing": "#F0861E",
    };

    const borderColors = {
      "Who is assessed": "#006A91",
      "The assessor": "#69518D",
      "Assessment artefact": "#B11F39",
      "Assessment format": "#80B57F",
      Context: "#D76487",
      "Assessment timing": "#C67129",
    };

    this.cardId = cardData["card-id"];
    const backgroundColor = categoryColors[cardCategory] || "#006A91";
    const borderColor = borderColors[cardCategory] || "#006A91";
    const cardIcon = cardData["card-icon"] || "./assets/img/default-icon.svg"; // Provide a default icon if none is specified

    const cardStyles = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .flipContainer {
        perspective: 1000px;
      }
      .cardFlipper {
        transform-style: preserve-3d;
        transition: transform 0.6s;
      }
       .cardBack {
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
        min-height: 520px;
      }
      .cardBack img {
  width: 100%;
  height: 520px;
  object-fit: cover;
  border-radius: 10px;
}

      .cardBack {
        transform: rotateY(180deg);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${backgroundColor};
        border-radius: 10px;
      }
      .card {
        align-items: center;
        background-color: ${backgroundColor};
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 520px;
        width: 300px;
      }
      .cardHeader {
        align-items: center;
        background-color: ${backgroundColor};
        border: 2px solid ${borderColor};
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: center;
        padding: 10px;
      }
      .cardCategory {
        color: #fff;
        font-size: 1.5em;
        font-weight: 800;
        margin-left: 10px;
        text-transform: uppercase;
      }
      .cardBackTitle{
        color: #000;
        font-size: 1.2em;
        font-weight: 800;
        margin-left: 10px;
        align-self: center;
        text-transform: uppercase;
      }
      .cardInner {
        width: 250px;
        margin: 20px;
        padding: 5px;
      }
      .cardWrapper {
    background-color: #fff;
    border: 2px solid ${borderColor};
    border-radius: 0 0 10px 10px;
    padding: 10px;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
      .cardName, .cardHow {
        font-size: 1.5em;
        font-weight: 800;
        margin: 10px 0;
        text-transform: uppercase;
      }

      .cardName{
        font-size: 1.5em;
  font-weight: 800;
  margin: 10px 0;
  text-transform: uppercase;
  white-space: normal;
  overflow-wrap: break-word;
      }

      .cardDescription, .cardDetails, .cardNumber {
        color: #636467;
      }
      .cardDetails {
        font-style: italic;
      }
      .Favorite, .cardFooter, .cardFlip {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }
      .cardFavorite, .cardFlip p {
        margin: 5px;
      }
      .cardIcon {
        width: 40px;
      }
      .cardHow {
        color: #636467;
        font-size: 1.2em;
        font-weight: 800;
        margin-bottom: 5px;
        text-transform: uppercase;
      }
      .cardNumber {
        font-style: italic;
      }
      .cardFlip {
        font-weight: 500;
      }
      .cardFooter {
        margin-top: 5px;
      }

    `;

    this.shadowRoot.innerHTML = `
      <style>${cardStyles}</style>
    <div class="flipContainer">
        <div class="cardFlipper">
            <div class="card">
                <div class="Favorite">
                    <img class="cardFavorite" src="./assets/img/star.svg" alt="favorite icon">
                </div>
                <div class="cardInner">
                    <div class="cardHeader">
                    <img class="cardIcon" src="${cardIcon}" alt="${cardName} icon">
                        <p class="cardCategory">${cardCategory}</p>
                    </div>
                    <div class="cardWrapper">
                        <div class="cardBodyUpper">
                        <p class="cardName">${cardName}</p>
                        <p class="cardDescription">${cardDescription}</p>
                        </div>
                        <div class="cardBodyUnder">
                        <p class="cardHow">How</p>
                        <p class="cardDetails">${cardDetails}</p>
                        </div>
                        <div class="cardFooter">
                        <p class="cardNumber">${cardId}</p>
                        </div>
                    </div>
                </div>
                <div class="cardFlip">
                    <p>Click To Flip</p>
                </div>
            </div>
          <div class="cardBack">
          <div>
            <p class="cardBackTitle">${cardCategory}</>
          </div>
          </div>
        </div>
    </div>
    `;

    const favoriteIcon = this.shadowRoot.querySelector(".cardFavorite");
    favoriteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFavorite();
    });

    this.shadowRoot
      .querySelector(".flipContainer")
      .addEventListener("click", () => {
        const flipper = this.shadowRoot.querySelector(".cardFlipper");
        flipper.style.transform =
          flipper.style.transform === "rotateY(180deg)"
            ? ""
            : "rotateY(180deg)";
      });
  }
  toggleFavorite() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.indexOf(this.cardId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(this.cardId);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));

    this.dispatchEvent(
      new CustomEvent("favoritesUpdated", { bubbles: true, composed: true }),
    );
  }
}

customElements.define("assessment-card", AssessmentCard);
export { AssessmentCard };
