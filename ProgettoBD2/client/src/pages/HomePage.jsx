import React from "react";
import "../styles/Layout.css"; // importa lo stile condiviso

const HomePage = () => {
  return (
    <div className="page-container">
      <h1>GameInsight</h1>
      <p>
        Benvenuto su <strong>GameInsight</strong>, una piattaforma interattiva
        per analizzare e gestire i dati relativi alle sessioni di gioco.
        Esplora le sezioni <strong>Giocatori</strong>, <strong>Sessioni</strong>{" "}
        e <strong>Analisi</strong> per comprendere meglio le abitudini dei
        giocatori e le performance di gioco.
      </p>
      <p>
        Usa la barra di navigazione in alto per iniziare.
      </p>
    </div>
  );
};

export default HomePage;


