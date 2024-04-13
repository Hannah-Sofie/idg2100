import React from "react";

import "../styles/Cards.css";

import CardForm from "../components/cardTypes/addNewCard";
import CardSearch from "../components/cardTypes/searchCard";
import IconFetcher from "../components/cardTypes/originalIcons";
import CustomIcon from "../components/cardTypes/CustomIcon";
import FormCard from "../components/cardTypes/formCard";

function Cards() {
  return (
    <div className="cards-management">
      <h1>Cards Management</h1>
      <CardForm />
      <CardSearch />
      <IconFetcher />
      <CustomIcon />
      <FormCard />
    </div>
  );
}

export default Cards;
