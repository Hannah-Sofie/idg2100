import React, { useState, useEffect } from "react";
import "./styles/createCard.css";

function IconFetcher() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");

  const categories = [
    { label: "Select a category", value: "" },
    { label: "Assessment: Who is assessed", value: "Who is assessed" },
    { label: "Assessment: The assessor", value: "The assessor" },
    { label: "Assessment: Assessment artefact", value: "Assessment artefact" },
    { label: "Assessment: Assessment format", value: "Assessment format" },
    { label: "Assessment: Context", value: "Context" },
    { label: "Assessment: Assessment timing", value: "Assessment timing" },
  ];

  useEffect(() => {
    if (selectedCategory) {
      const customIconUrl = `http://localhost:8001/api/cards/assessment/icon/${encodeURIComponent(selectedCategory)}`;
      const placeholderIconUrl = `http://localhost:8001/api/cards/upload/icons/placeholders/${encodeURIComponent(selectedCategory)}`;

      setFallbackUrl(placeholderIconUrl);

      fetch(customIconUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Not found");
          return response.blob();
        })
        .then((blob) => {
          if (blob.type.startsWith("image/")) {
            setIconUrl(customIconUrl);
          } else {
            throw new Error("Not an image");
          }
        })
        .catch(() => {
          // Use the fallback URL
          setIconUrl(placeholderIconUrl);
        });
    } else {
      setIconUrl("");
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="formWrapper">
      <h2>Card Category Icons</h2>
      <p>Select a category to fetch the corresponding icon:</p>
      <div className="formContent">
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <select
              name="card-category"
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory && (
            <div>
              <img
                className="IconPreview"
                src={iconUrl || fallbackUrl}
                alt="Selected Category Icon"
                onError={(e) => (e.target.src = fallbackUrl)}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default IconFetcher;
