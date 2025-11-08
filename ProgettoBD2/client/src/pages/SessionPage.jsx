import { useState } from "react";
import SessionList from "../components/SessionList";
import SessionForm from "../components/SessionForm";
import { updateSession } from "../api/sessionApi";
import axios from "axios";
import "../styles/Management.css";
import "../styles/Layout.css";
import { useSubmitStatus } from "../utils/useSubmitStatus";
import StatusMessage from "../utils/StatusMessage";


export default function SessionPage() {
  const [view, setView] = useState("home");

  // Stati per l'update
  const [searchId, setSearchId] = useState("");
  const [sessionFound, setSessionFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [updatedSession, setUpdatedSession] = useState(null); // ← AGGIUNGI QUESTO

  const { submitMessage, 
    submitError, 
    showSuccess, 
    showError, 
    clearMessages } = useSubmitStatus();

  const [updateData, setUpdateData] = useState({
    PlayerID: "",
    PlayTimeHours: "",
    InGamePurchases: "",
    SessionsPerWeek: "",
    AvgSessionDurationMinutes: "",
    GameGenre: "",
    GameDifficulty: "",
  });

  // Cerca la sessione per SessionID
  const handleSearchSession = async () => {
    const trimmedId = searchId.trim();
    if (!trimmedId) {
      setSearchError("Inserisci un SessionID");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSessionFound(null);
    setUpdatedSession(null); // ← Reset anche updatedSession

    try {
      const response = await axios.get(`/api/sessions/${trimmedId}`);
      if (response.data) {
        setSessionFound(response.data);
        // Precompila il form con i dati trovati
        setUpdateData({
          PlayerID: response.data.PlayerID || "",
          PlayTimeHours: response.data.PlayTimeHours || "",
          InGamePurchases: response.data.InGamePurchases || "",
          SessionsPerWeek: response.data.SessionsPerWeek || "",
          AvgSessionDurationMinutes: response.data.AvgSessionDurationMinutes || "",
          GameGenre: response.data.GameGenre || "",
          GameDifficulty: response.data.GameDifficulty || "",
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchError(`Sessione con ID "${trimmedId}" non trovata`);
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
      handleSearchSession();
    }
  };

  // Update della sessione
  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      const response = await updateSession(sessionFound.SessionID, updateData);
      //showSuccess("Sessione aggiornata con successo!");
      
      // Salva i dati aggiornati per mostrarli
      setUpdatedSession(response.data); // ← AGGIUNGI QUESTO
      
      // Reset
      setSearchId("");
      setSessionFound(null);
      setUpdateData({
        PlayerID: "",
        PlayTimeHours: "",
        InGamePurchases: "",
        SessionsPerWeek: "",
        AvgSessionDurationMinutes: "",
        GameGenre: "",
        GameDifficulty: "",
      });
    } catch (error) {
      showError("Errore nell'aggiornamento della sessione");
      console.error(error);
    }
  };

  return (
    <div className="page-container management-container">
      <h1>Gestione Sessioni di Gioco</h1>
      {view === "home" && <h2>Seleziona un'operazione CRUD da eseguire.</h2>}
      
      <div className="crud-buttons">
        <button onClick={() => setView("create")}>Crea</button>
        <button onClick={() => setView("read")}>Visualizza</button>
        <button onClick={() => setView("update")}>Aggiorna</button>
        <button onClick={() => setView("delete")}>Rimuovi</button>
      </div>

      {view === "create" && <SessionForm />}
      {view === "read" && <SessionList />}
      {view === "delete" && (
        <>
          <h2>Elimina una Sessione</h2>
          <p>Cerca la sessione e clicca sul pulsante "Elimina".</p>
          <SessionList showDeleteButton={true} />
        </>
      )}
      
      {view === "update" && (
        <div>
          <h2>Aggiorna Dati Sessione</h2>

          <StatusMessage submitMessage={submitMessage} submitError={submitError} />

          {/* Barra di ricerca */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "0.5rem" }}>
              Cerca la sessione da modificare inserendo il suo SessionID
            </p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Cerca per SessionID (es. 10000)"
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
                onClick={handleSearchSession}
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

          {/* Form di aggiornamento (mostrato solo se la session è stata trovata) */}
          {sessionFound && (
            <>
              <div style={{ 
                padding: "1rem", 
                backgroundColor: "rgba(0, 196, 180, 0.1)", 
                borderRadius: "4px",
                marginBottom: "1rem",
                border: "1px solid #00c4b4"
              }}>
                <p style={{ color: "#00c4b4", margin: 0 }}>
                  Sessione trovata: <strong>{sessionFound.SessionID}</strong>
                </p>
                <p style={{ fontSize: "0.85rem", color: "#888", margin: "0.25rem 0 0 0" }}>
                  Modifica i campi che desideri aggiornare
                </p>
              </div>

              <form className="form" onSubmit={handleUpdate}>
                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Player ID (non modificabile)
                  </label>
                  <input
                    type="text"
                    placeholder="Player ID"
                    value={updateData.PlayerID}
                    disabled 
                    style={{
                      backgroundColor: "rgba(100, 100, 100, 0.3)", 
                      cursor: "not-allowed"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Ore di gioco
                  </label>
                  <input
                    type="number"
                    placeholder="Ore di gioco"
                    value={updateData.PlayTimeHours}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, PlayTimeHours: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Acquisti in-game
                  </label>
                  <select
                    value={updateData.InGamePurchases}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, InGamePurchases: e.target.value === "true" })
                    }
                  >
                    <option value="" disabled>Seleziona</option> {/* ← AGGIUNGI disabled */}
                    <option value="true">Sì</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Sessioni a settimana
                  </label>
                  <input
                    type="number"
                    placeholder="Sessioni a settimana"
                    value={updateData.SessionsPerWeek}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, SessionsPerWeek: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Durata media (minuti)
                  </label>
                  <input
                    type="number"
                    placeholder="Durata media (minuti)"
                    value={updateData.AvgSessionDurationMinutes}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, AvgSessionDurationMinutes: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Genere
                  </label>
                  <select
                    value={updateData.GameGenre}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, GameGenre: e.target.value })
                    }
                  >
                    <option value="" disabled>Seleziona il genere</option> {/* ← AGGIUNGI disabled */}
                    <option value="Action">Action</option>
                    <option value="Sports">Sports</option>
                    <option value="RPG">RPG</option>
                    <option value="Simulation">Simulation</option>
                    <option value="Strategy">Strategy</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", color: "#00c4b4", marginBottom: "0.25rem", display: "block" }}>
                    Difficoltà
                  </label>
                  <select
                    value={updateData.GameDifficulty}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, GameDifficulty: e.target.value })
                    }
                  >
                    <option value="" disabled>Seleziona la difficoltà</option> {/* ← AGGIUNGI disabled */}
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <button type="submit">Aggiorna Sessione</button>
              </form>
            </>
          )}

          {/* ← AGGIUNGI QUESTA SEZIONE: Mostra i dati aggiornati */}
          {updatedSession && (
            <div style={{ 
              marginTop: "2rem", 
              padding: "1.5rem", 
              backgroundColor: "rgba(0, 196, 180, 0.1)", 
              borderRadius: "8px",
              border: "2px solid #00c4b4"
            }}>
              <h3 style={{ color: "#00c4b4", marginBottom: "1rem" }}>
                Sessione aggiornata con successo!
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
                      <th style={{ padding: "0.75rem" }}>SessionID</th>
                      <th style={{ padding: "0.75rem" }}>PlayerID</th>
                      <th style={{ padding: "0.75rem" }}>PlayTimeHours</th>
                      <th style={{ padding: "0.75rem" }}>InGamePurchases</th>
                      <th style={{ padding: "0.75rem" }}>SessionsPerWeek</th>
                      <th style={{ padding: "0.75rem" }}>AvgSessionDurationMinutes</th>
                      <th style={{ padding: "0.75rem" }}>GameGenre</th>
                      <th style={{ padding: "0.75rem" }}>GameDifficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.SessionID}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.PlayerID}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.PlayTimeHours}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.InGamePurchases ? "Sì" : "No"}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.SessionsPerWeek}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.AvgSessionDurationMinutes}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.GameGenre}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{updatedSession.GameDifficulty}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button 
                onClick={() => setUpdatedSession(null)}
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
                Aggiorna un'altra sessione
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}