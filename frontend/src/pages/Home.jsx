import SectionContent from "../components/SectionContent";
import LiquidEther from "../components/LiquidEther";
import { useState } from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <LiquidEther
            colors={['#ff6600', '#ff8833', '#ff9944']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
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
