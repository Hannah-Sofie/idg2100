import React, { useState } from "react";
import axios from "axios";
import "./styles/formCard.css";

const FormCard = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("cards", file);

    try {
      const response = await axios.post(
        "http://localhost:8001/api/cards/upload/upload-json",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setMessage("Cards uploaded successful");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error uploading cards");
    }
  };

  return (
    <div className="formWrapper">
      <h1>Upload JSON</h1>
      <p>Upload a JSON file with card data</p>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".json" onChange={handleFileChange} />
          <button type="submit">Upload JSON</button>
        </form>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default FormCard;
