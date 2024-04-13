import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import CardsGame from "../components/fromAssignment1/CardsGame";

function Home() {
  return (
    <main className="home-container">
      <section className="welcome">
        <h1>Welcome to the SUPER Assessor Game!</h1>
        <p>
          Discover a new way to learn and assess your knowledge through
          interactive mission and assessment cards. Get ready to embark on your
          learning adventure!
        </p>
      </section>
      <section className="gameplay">
        <h2>Gameplay Simplified:</h2>
        <ol>
          <li>
            <span>Setup:</span> Choose your missions and initial cards.
          </li>
          <li>
            <span>Action:</span> Add, remove, or replace cards to shape your
            method.
          </li>
          <li>
            <span>Conclusion:</span> Finalize and evaluate your innovative
            assessment method.
          </li>
        </ol>
      </section>

      <section className="cards">
        <h2>Sample game and cards</h2>
        <CardsGame />
      </section>

      <section className="user-action">
        <h2>Join Our Community of Innovators!</h2>
        <p>
          Ready to take your assessment methods to the next level? Create an
          account now and gain the power to customize, save, and share your
          educational tools with a global community of educators. Let’s make
          learning more effective and fun together!
        </p>
        <div className="buttons">
          <Link to="/login">
            <button aria-label="Login to your account">Login</button>
          </Link>
          <Link to="/register">
            <button aria-label="Register a new account">Register</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
