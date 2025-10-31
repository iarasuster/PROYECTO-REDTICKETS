import SectionContent from "../components/SectionContent";
import { useState } from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Creamos experiencias, gestionamos momentos.
          </h1>
          <p className="hero-subtitle">
            En RedTickets acompañamos a productores, artistas y marcas a
            conectar con su público.
          </p>
        </div>
      </section>

      {/* Contenido de Inicio */}
      <section className="contenido-section">
        <div className="container">
          <SectionContent seccion="inicio" />
        </div>
      </section>
    </div>
  );
};

export default Home;
