import SectionContent from "../components/SectionContent";
import LiquidEther from "../components/LiquidEther";
import { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  // Detectar si el dispositivo puede manejar LiquidEther
  const [canUseLiquidEther, setCanUseLiquidEther] = useState(false);

  useEffect(() => {
    // Deshabilitar LiquidEther SOLO en tablets (768-1023px)
    const checkCanUseLiquidEther = () => {
      const width = window.innerWidth;
      const isTablet = width >= 768 && width < 1024;
      setCanUseLiquidEther(!isTablet); // Usar en todo EXCEPTO tablets
    };

    checkCanUseLiquidEther();
    window.addEventListener("resize", checkCanUseLiquidEther);
    return () => window.removeEventListener("resize", checkCanUseLiquidEther);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        {canUseLiquidEther ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <LiquidEther
              colors={["#ff6600", "#ff8833", "#ff9944"]}
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
        ) : (
          /* Fallback: degradado simple para dispositivos de bajo rendimiento */
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              background:
                "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #ff6600 50%, #ff8833 75%, #1a1a1a 100%)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 15s ease infinite",
            }}
          />
        )}
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
