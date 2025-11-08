import React, { useState } from "react";
import { createSession } from "../api/sessionApi";
import axios from "axios";
import "../styles/Form.css";
import { useSubmitStatus } from "../utils/useSubmitStatus";
import StatusMessage from "../utils/StatusMessage";

const SessionForm = () => {
  const [formData, setFormData] = useState({
    PlayerID: "",
    PlayTimeHours: "",
    InGamePurchases: false,
    SessionsPerWeek: "",
    AvgSessionDurationMinutes: "",
    GameGenre: "",
    GameDifficulty: ""
  });

  const { submitMessage, 
    submitError, 
    showSuccess, 
    showError, 
    clearMessages } = useSubmitStatus();

  const [createdSession, setCreatedSession] = useState(null);
  const [playerIdValid, setPlayerIdValid] = useState(null);
  const [isCheckingPlayer, setIsCheckingPlayer] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    if (name === "PlayerID") {
      setPlayerIdValid(null);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleVerifyPlayer = async () => {
    const trimmedId = formData.PlayerID.trim();
    if (!trimmedId) {
      setPlayerIdValid(false);
      return;
    }

    setIsCheckingPlayer(true);
    try {
      const response = await axios.get(`/api/players/${trimmedId}`);
      if (response.data) {
        setPlayerIdValid(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setPlayerIdValid(false);
      } else {
        setPlayerIdValid(false);
      }
    } finally {
      setIsCheckingPlayer(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.PlayTimeHours && parseFloat(formData.PlayTimeHours) < 0) {
      newErrors.PlayTimeHours = "Le ore di gioco devono essere positive";
    }

    if (formData.SessionsPerWeek && (parseFloat(formData.SessionsPerWeek) < 1 || !Number.isInteger(parseFloat(formData.SessionsPerWeek)))) {
      newErrors.SessionsPerWeek = "Le sessioni settimanali devono essere un numero intero ≥ 1";
    }

    if (formData.AvgSessionDurationMinutes && parseFloat(formData.AvgSessionDurationMinutes) < 1) {
      newErrors.AvgSessionDurationMinutes = "La durata media deve essere almeno 1 minuto";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (playerIdValid !== true) {
      showError("Verifica prima che il PlayerID esista usando il pulsante 'Verifica'");
      return;
    }

    if (!validateForm()) {
      showError("Correggi gli errori nel form prima di procedere");
      return;
    }

    try {
      const response = await createSession(formData);
      //showSuccess("Sessione creata con successo!");
      
      setCreatedSession(response.data);
      
      setFormData({
        PlayerID: "",
        PlayTimeHours: "",
        InGamePurchases: false,
        SessionsPerWeek: "",
        AvgSessionDurationMinutes: "",
        GameGenre: "",
        GameDifficulty: ""
      });
      setPlayerIdValid(null);
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Errore nella creazione della sessione";
      showError(`${errorMessage}`);
      console.error(error);
    }
  };

  return (
    <div>
      {/* Mostra il form SOLO se non c'è una sessione creata */}
      {!createdSession ? (
        <form className="form" onSubmit={handleSubmit}>
          <h2>Crea una nuova Sessione</h2>
          <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "1rem" }}>
            L'ID della sessione verrà assegnato automaticamente (formato numerico).
          </p>

          <StatusMessage submitMessage={submitMessage} submitError={submitError} />

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="number"
                name="PlayerID"
                placeholder="Player ID (es. 10000)"
                value={formData.PlayerID}
                onChange={handleChange}
                required
                style={{
                  flex: 1,
                  borderColor: playerIdValid === true ? "#00c4b4" : playerIdValid === false ? "#ff6b6b" : undefined
                }}
              />
              <button
                type="button"
                onClick={handleVerifyPlayer}
                disabled={isCheckingPlayer || !formData.PlayerID.toString().trim()}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: playerIdValid === true ? "#00c4b4" : "#555",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isCheckingPlayer ? "wait" : "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {isCheckingPlayer ? "Verifica..." : playerIdValid === true ? "✓ Verificato" : "Verifica"}
              </button>
            </div>
            {playerIdValid === false && (
              <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                PlayerID non trovato
              </p>
            )}
            {playerIdValid === true && (
              <p style={{ color: "#00c4b4", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                PlayerID valido
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="PlayTimeHours"
              placeholder="Ore di gioco"
              value={formData.PlayTimeHours}
              onChange={handleChange}
              min="0"
              step="0.1"
              style={{ borderColor: errors.PlayTimeHours ? "#ff6b6b" : undefined }}
            />
            {errors.PlayTimeHours && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>{errors.PlayTimeHours}</p>}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="InGamePurchases"
              checked={formData.InGamePurchases}
              onChange={handleChange}
            />
            Acquisti in-game
          </label>

          <div>
            <input
              type="number"
              name="SessionsPerWeek"
              placeholder="Sessioni a settimana"
              value={formData.SessionsPerWeek}
              onChange={handleChange}
              min="1"
              step="1"
              style={{ borderColor: errors.SessionsPerWeek ? "#ff6b6b" : undefined }}
            />
            {errors.SessionsPerWeek && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>{errors.SessionsPerWeek}</p>}
          </div>

          <div>
            <input
              type="number"
              name="AvgSessionDurationMinutes"
              placeholder="Durata media (minuti)"
              value={formData.AvgSessionDurationMinutes}
              onChange={handleChange}
              min="1"
              step="0.1"
              style={{ borderColor: errors.AvgSessionDurationMinutes ? "#ff6b6b" : undefined }}
            />
            {errors.AvgSessionDurationMinutes && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>{errors.AvgSessionDurationMinutes}</p>}
          </div>

          <select name="GameGenre" value={formData.GameGenre} onChange={handleChange} required>
            <option value="" disabled>Genere</option>
            <option value="Action">Action</option>
            <option value="Sports">Sports</option>
            <option value="RPG">RPG</option>
            <option value="Simulation">Simulation</option>
            <option value="Strategy">Strategy</option>
          </select>

          <select name="GameDifficulty" value={formData.GameDifficulty} onChange={handleChange} required>
            <option value="" disabled>Difficoltà</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button type="submit">Salva sessione</button>
        </form>
      ) : (
        /* Mostra SOLO la tabella quando la sessione è stata creata */
        <div style={{ 
          marginTop: "2rem", 
          padding: "1.5rem", 
          backgroundColor: "rgba(0, 196, 180, 0.1)", 
          borderRadius: "8px",
          border: "2px solid #00c4b4"
        }}>
          <h3 style={{ color: "#00c4b4", marginBottom: "1rem" }}>
            Sessione creata con successo!
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
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.SessionID}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.PlayerID}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.PlayTimeHours}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.InGamePurchases ? "Sì" : "No"}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.SessionsPerWeek}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.AvgSessionDurationMinutes}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.GameGenre}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdSession.GameDifficulty}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button 
            onClick={() => setCreatedSession(null)}
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
            Crea un'altra sessione
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionForm;