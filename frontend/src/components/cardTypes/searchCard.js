import React, { useState } from "react";
import axios from "axios";
import "./styles/createCard.css";
import "./styles/searchItem.css";

function CardSearch() {
  const [cardData, setCardData] = useState({
    "card-id": "",
    "card-type": "",
    "card-category": "",
    "card-name": "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEditChange = (e) => {
    setEditData(e.target.value);
  };
  const handleEdit = (data) => {
    setEditData(JSON.stringify(data, null, 2));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = JSON.parse(editData);
      await axios.put(
        `http://127.0.0.1:8001/api/cards/upload/updateCard/${updatedData["card-id"]}`,
        updatedData,
      );
      alert("Card updated successfully");
      setEditData(null);
      handleSearch();
    } catch (error) {
      console.error("Error updating card:", error);
      alert("Error updating card. Check console for details.");
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setEditData(null);
    setSearchResults([]);
    setIsLoading(true);

    const endpoint =
      cardData["card-type"] === "assessment"
        ? "http://127.0.0.1:8001/api/cards/assessment"
        : "http://127.0.0.1:8001/api/cards/mission";

    try {
      const { data } = await axios.get(endpoint);

      const filteredData = data.filter((card) => {
        const inputCardId = cardData["card-id"]
          ? Number(cardData["card-id"])
          : null;
        const isCardIdMatch =
          inputCardId === null || card["card-id"] === inputCardId;

        // Filter based on card-type
        if (cardData["card-type"] === "assessment") {
          return (
            isCardIdMatch &&
            (!cardData["card-category"] ||
              card["card-category"] === cardData["card-category"])
          );
        } else {
          return (
            isCardIdMatch &&
            (!cardData["card-name"] ||
              card["card-name"] === cardData["card-name"])
          );
        }
      });

      setSearchResults(filteredData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching and filtering cards:", error);
      alert("Error searching for cards. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbort = () => {
    setEditData(null);
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8001/api/cards/upload/deleteCard/${cardId}`,
      );
      alert("Card deleted successfully");
      handleSearch();
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Error deleting card. Check console for details.");
    }
  };

  return (
    <div className="formWrapper">
      <h2>Search Cards and edit/delete</h2>
      <p>Or add custon icons through links.</p>
      <div className="formContent">
        <form onSubmit={handleSearch}>
          <div>
            <label>Card ID</label>
            <input
              type="text"
              name="card-id"
              value={cardData["card-id"]}
              onChange={handleChange}
              placeholder="Card ID"
            />
          </div>
          <div>
            <label>Card Type</label>
            <select
              name="card-type"
              value={cardData["card-type"]}
              onChange={handleChange}
            >
              <option value="">Select Card Type</option>
              <option value="assessment">Assessment</option>
              <option value="mission">Mission</option>
            </select>
          </div>
          <input type="submit" value="Search Cards" />
        </form>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="searchResults">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="resultItem">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                  <button
                    className="resultButton"
                    onClick={() => handleEdit(result)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(result["card-id"])}
                    className="resultButton"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div>No results found.</div>
            )}
          </div>
        )}
        {editData && (
          <div>
            <h3>Edit Card Data</h3>
            <textarea
              value={editData}
              onChange={handleEditChange}
              rows="10"
              cols="50"
            />
            <div>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleAbort}>Abort</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardSearch;
