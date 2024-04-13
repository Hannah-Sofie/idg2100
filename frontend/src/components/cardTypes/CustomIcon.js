import React, { useState } from "react";
import "./styles/createCard.css";

function CustomIcon() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    { label: "Select a category", value: "" },
    { label: "Assessment: Who is assessed", value: "Who is assessed" },
    { label: "Assessment: The assessor", value: "The assessor" },
    { label: "Assessment: Assessment artefact", value: "Assessment artefact" },
    { label: "Assessment: Assessment format", value: "Assessment format" },
    { label: "Assessment: Context", value: "Context" },
    { label: "Assessment: Assessment timing", value: "Assessment timing" },
  ];

  const getUploadUrl = (category) => {
    switch (category) {
      case "Who is assessed":
        return "http://localhost:8001/api/cards/upload/upload-icon/Who%20is%20assessed";

      case "Assessment artefact":
        return "http://localhost:8001/api/cards/upload/upload-icon/Assessment%20artefact";
      case "Assessment format":
        return "http://localhost:8001/api/cards/upload/upload-icon/Assessment%20format";
      case "The assessor":
        return "http://localhost:8001/api/cards/upload/upload-icon/The%20assessor";
      case "Context":
        return "http://localhost:8001/api/cards/upload/upload-icon/Context";
      case "Assessment timing":
        return "http://localhost:8001/api/cards/upload/upload-icon/Assessment%20timing";
      default:
        return "";
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    const uploadUrl = getUploadUrl(selectedCategory);
    const formData = new FormData();
    formData.append("icon", selectedFile);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("File uploaded successfully");
      } else {
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="formWrapper">
      <h2>Upload Card Icon</h2>
      <div className="formContent">
        <form onSubmit={handleSubmit}>
          <div>
            <p>Select a category to upload an icon</p>
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
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CustomIcon;
