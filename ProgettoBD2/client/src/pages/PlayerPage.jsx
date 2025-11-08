import { useState } from "react";
import PlayerForm from "../components/PlayerForm";
import PlayerList from "../components/PlayerList";
import { updatePlayer } from "../api/playerApi";
import axios from "axios";
import "../styles/management.css";
import "../styles/Layout.css";
import { useSubmitStatus } from "../utils/useSubmitStatus";
import StatusMessage from "../utils/StatusMessage";

export default function PlayerPage() {
  const [view, setView] = useState("home");

  // Stati per l'update
  const [searchId, setSearchId] = useState("");
  const [playerFound, setPlayerFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [updatedPlayer, setUpdatedPlayer] = useState(null); // ← AGGIUNGI QUESTO

  const { submitMessage, 
    submitError, 
    showSuccess, 
    showError, 
    clearMessages } = useSubmitStatus();

  const [updateData, setUpdateData] = useState({
    Age: "",
    Gender: "",
    Location: "",
    PlayerLevel: "",
    AchievementsUnlocked: "",
    EngagementLevel: "",
  });

  // Cerca il giocatore per PlayerID
  const handleSearchPlayer = async () => {
    const trimmedId = searchId.trim();
    if (!trimmedId) {
      setSearchError("Inserisci un PlayerID");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setPlayerFound(null);
    setUpdatedPlayer(null); // ← Reset anche updatedPlayer

    try {
      const response = await axios.get(`/api/players/${trimmedId}`);
      if (response.data) {
        setPlayerFound(response.data);
        // Precompila il form con i dati trovati
        setUpdateData({
          Age: response.data.Age || "",
          Gender: response.data.Gender || "",
          Location: response.data.Location || "",
          PlayerLevel: response.data.PlayerLevel || "",
          AchievementsUnlocked: response.data.AchievementsUnlocked || "",
          EngagementLevel: response.data.EngagementLevel || "",
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchError(`Giocatore con ID "${trimmedId}" non trovato`);
      } else {
        setSearchError("Errore durante la ricerca");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Gestione Enter nella ricerca
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchPlayer();
    }
  };

  // Update del giocatore
  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      const response = await updatePlayer(playerFound.PlayerID, updateData);
      //showSuccess("Giocatore aggiornato con successo!");
      
      // Salva i dati aggiornati per mostrarli
      setUpdatedPlayer(response.data); // ← AGGIUNGI QUESTO
      
      // Reset del form di ricerca
      setSearchId("");
      setPlayerFound(null);
      setUpdateData({
        Age: "",
        Gender: "",
        Location: "",
        PlayerLevel: "",
        AchievementsUnlocked: "",
        EngagementLevel: "",
      });
    } catch (error) {
      showError("Errore nell'aggiornamento del giocatore");
      console.error(error);
    }
  };

  return (
    <div className="page-container management-container">
      <h1>Gestione Giocatori</h1>
      {view === "home" && <h2>Seleziona un'operazione CRUD da eseguire.</h2>}
      
      <div className="crud-buttons">
        <button onClick={() => setView("create")}>Crea</button>
        <button onClick={() => setView("read")}>Visualizza</button>
        <button onClick={() => setView("update")}>Aggiorna</button>
        <button onClick={() => setView("delete")}>Rimuovi</button>
      </div>

      {view === "create" && <PlayerForm />}
      {view === "read" && <PlayerList />}
      {view === "delete" && (
        <>
          <h2>Elimina un Giocatore</h2>
          <p>Cerca il giocatore e clicca sul pulsante "Elimina".</p>
          <PlayerList showDeleteButton={true} />
        </>
      )}
      
      {view === "update" && (
        <div>
          <h2>Aggiorna Dati Giocatore</h2>

          <StatusMessage submitMessage={submitMessage} submitError={submitError} />

          {/* Barra di ricerca */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "0.5rem" }}>
              Cerca il giocatore da modificare inserendo il suo PlayerID
            </p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Cerca per PlayerID (es.10000)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ 
                  flex: 1, 
                  padding: "0.5rem",
                  borderColor: searchError ? "#ff6b6b" : undefined
                }}
              />
              <button
                type="button"
                onClick={handleSearchPlayer}
                disabled={isSearching}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#00c4b4",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isSearching ? "wait" : "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {isSearching ? "Ricerca..." : "Cerca"}
              </button>
            </div>
            
            {searchError && (
              <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                {searchError}
              </p>
            )}
          </div>

          {/* Form di aggiornamento (mostrato solo se il player è stato trovato) */}
          {playerFound && (
            <>
              <div style={{ 
                padding: "1rem", 
                backgroundColor: "rgba(0, 196, 180, 0.1)", 
                borderRadius: "4px",
                marginBottom: "1rem",
                border: "1px solid #00c4b4"
              }}>
                <p style={{ color: "#00c4b4", margin: 0 }}>
                  Giocatore trovato: <strong>{playerFound.PlayerID}</strong>
                </p>
                <p style={{ fontSize: "0.85rem", color: "#888", margin: "0.25rem 0 0 0" }}>
                  Modifica i campi che desideri aggiornare
                </p>
              </div>

              <form className="form" onSubmit={handleUpdate}>
                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Età
                  </label>
                  <input
                    type="number"
                    placeholder="Età"
                    value={updateData.Age}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, Age: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Sesso
                  </label>
                  <select 
                    name="Gender" 
                    value={updateData.Gender} 
                    onChange={(e) =>
                      setUpdateData({ ...updateData, Gender: e.target.value })
                    }
                  >
                    <option value="" disabled>Sesso</option> {/* ← AGGIUNGI disabled */}
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Località
                  </label>
                  <select 
                    name="Location" 
                    value={updateData.Location}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, Location: e.target.value })
                    }
                  >
                    <option value="" disabled>Località</option> {/* ← AGGIUNGI disabled */}
                    <option value="USA">USA</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Livello Giocatore
                  </label>
                  <input
                    type="number"
                    placeholder="Livello Giocatore"
                    value={updateData.PlayerLevel}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, PlayerLevel: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Obiettivi Sbloccati
                  </label>
                  <input
                    type="number"
                    placeholder="Obiettivi Sbloccati"
                    value={updateData.AchievementsUnlocked}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, AchievementsUnlocked: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Coinvolgimento
                  </label>
                  <select 
                    name="EngagementLevel" 
                    value={updateData.EngagementLevel}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, EngagementLevel: e.target.value })
                    }
                  >
                    <option value="" disabled>Coinvolgimento</option> {/* ← AGGIUNGI disabled */}
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <button type="submit">Aggiorna Giocatore</button>
              </form>
            </>
          )}

          {/* ← AGGIUNGI QUESTA SEZIONE: Mostra i dati aggiornati */}
          {updatedPlayer && (
            <div style={{ 
              marginTop: "2rem", 
              padding: "1.5rem", 
              backgroundColor: "rgba(0, 196, 180, 0.1)", 
              borderRadius: "8px",
              border: "2px solid #00c4b4"
            }}>
              <h3 style={{ color: "#00c4b4", marginBottom: "1rem" }}>
                Giocatore aggiornato con successo!
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  color: "#fff",
                }}>
                  <thead>
                    <tr style={{ background: "#222", color: "#00c4b4" }}>
                      <th style={{ padding: "0.75rem" }}>PlayerID</th>
                      <th style={{ padding: "0.75rem" }}>Age</th>
                      <th style={{ padding: "0.75rem" }}>Gender</th>
                      <th style={{ padding: "0.75rem" }}>Location</th>
                      <th style={{ padding: "0.75rem" }}>Level</th>
                      <th style={{ padding: "0.75rem" }}>Achievements</th>
                      <th style={{ padding: "0.75rem" }}>Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.PlayerID}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.Age}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.Gender}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.Location}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.PlayerLevel}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.AchievementsUnlocked}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedPlayer.EngagementLevel}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button 
                onClick={() => setUpdatedPlayer(null)}
                style={{ 
                  marginTop: "1rem", 
                  padding: "0.5rem 1rem",
                  backgroundColor: "#00c4b4",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Aggiorna un altro giocatore
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}