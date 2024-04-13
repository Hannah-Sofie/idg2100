class MissionCards extends HTMLElement {
  static get observedAttributes() {
    return ["card-id", "card-type", "card-name"];
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
      const response = await fetch("http://localhost:8001/api/cards/mission");
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
    const cardType = this.getAttribute("card-type");
    const cardName = this.getAttribute("card-name");

    if (cardId) {
      const numericCardId = Number(cardId);
      filteredData = filteredData.filter(
        (card) => card["card-id"] === numericCardId,
      );
    } else if (cardType) {
      filteredData = filteredData.filter(
        (card) => card["card-type"] === cardType,
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
      "card-type": cardType,
      "card-name": cardName,
      "card-description": cardDescription,
    } = cardData;

    this.cardId = cardData["card-id"];

    const [boldPart, restPart] = cardDescription.split("\n", 2);
    const formattedDescription = `<p class="boldText">${boldPart}</p>${restPart ? "\n" + restPart : ""}`;

    const cardStyles = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

    .boldText{
 font-weight: 800;
 font-size: 1.2em;
 color: #000;
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
        background-color: #FFF2BB;
        border-radius: 10px;
      }
      .card {
        align-items: center;
        background-color: #FFF2BB;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 520px;
        width: 300px;
        margin: 10px 0;
      }

      .cardType {
        color: #000;
        font-size: 1.5em;
        font-weight: 800;
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
      }
      .cardWrapper {
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    padding: 15px;
    margin-bottom: 10px;
    min-height: 420px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
      .cardName {
        font-size: 1.5em;
        font-weight: 800;
        text-transform: uppercase;
      }

      .cardName{
        font-size: 1.5em;
  font-weight: 800;
  text-transform: uppercase;
  overflow-wrap: break-word;
      }

      .cardNumber {
        color: #636467;
      }
      .Favorite, .cardFooter, .cardFlip {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }
      .cardFavorite, .cardFlip p {
        margin: 5px;
      }

      .cardNumber {
        font-style: italic;
      }
      .cardFlip {
        font-weight: 500;
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
                    <div class="cardWrapper">
                        <p class="cardType">${cardType}</p>
                        <p class="cardName">${cardName}</p>
                        <p class="cardDescription">${formattedDescription}</p>
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
            <p class="cardBackTitle">${cardType}</>
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
    console.log("clicked");
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

customElements.define("mission-card", MissionCards);
export { MissionCards };
