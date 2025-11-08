import React, { useState } from "react";
import { createPlayer } from "../api/playerApi";
import "../styles/Form.css";
import { useSubmitStatus } from "../utils/useSubmitStatus";
import StatusMessage from "../utils/StatusMessage";

const PlayerForm = () => {
  const [formData, setFormData] = useState({
    Age: "",
    Gender: "",
    Location: "",
    PlayerLevel: "",
    AchievementsUnlocked: "",
    EngagementLevel: ""
  });

  const [createdPlayer, setCreatedPlayer] = useState(null);
  const [errors, setErrors] = useState({});

   const { submitMessage, 
    submitError, 
    showSuccess, 
    showError, 
    clearMessages } = useSubmitStatus();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.Age && (parseFloat(formData.Age) < 0 || !Number.isInteger(parseFloat(formData.Age)))) {
      newErrors.Age = "L'età deve essere un numero intero positivo";
    }

    if (formData.PlayerLevel && (parseFloat(formData.PlayerLevel) < 0 || !Number.isInteger(parseFloat(formData.PlayerLevel)))) {
      newErrors.PlayerLevel = "Il livello deve essere un numero intero positivo";
    }

    if (formData.AchievementsUnlocked && (parseFloat(formData.AchievementsUnlocked) < 0 || !Number.isInteger(parseFloat(formData.AchievementsUnlocked)))) {
      newErrors.AchievementsUnlocked = "I traguardi devono essere un numero intero positivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) {
      showError("Correggi gli errori nel form prima di procedere");
      return;
    }

    try {
      const response = await createPlayer(formData);
      //showSuccess("Giocatore creato con successo!");
      
      setCreatedPlayer(response.data);
      
      setFormData({
        Age: "",
        Gender: "",
        Location: "",
        PlayerLevel: "",
        AchievementsUnlocked: "",
        EngagementLevel: ""
      });
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Errore nella creazione del giocatore";
      showError(`${errorMessage}`);
      console.error(error);
    }
  };

  return (
    <div>
      {/* Mostra il form SOLO se non c'è un giocatore creato */}
      {!createdPlayer ? (
        <form className="form" onSubmit={handleSubmit}>
          <h2>Crea un nuovo Giocatore</h2>
          <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "1rem" }}>
            L'ID del giocatore verrà assegnato automaticamente (formato numerico).
          </p>

          <StatusMessage submitMessage={submitMessage} submitError={submitError} />

          <div>
            <input
              type="number"
              name="Age"
              placeholder="Età"
              value={formData.Age}
              onChange={handleChange}
              min="1"
              step="1"
              style={{ borderColor: errors.Age ? "#ff6b6b" : undefined }}
            />
            {errors.Age && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>{errors.Age}</p>}
          </div>

          <select name="Gender" value={formData.Gender} onChange={handleChange} required>
            <option value="" disabled >Sesso</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select name="Location" value={formData.Location} onChange={handleChange} required>
            <option value="" disabled>Località</option>
            <option value="USA">USA</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Other">Other</option>
          </select>

          <div>
            <input
              type="number"
              name="PlayerLevel"
              placeholder="Livello del Giocatore"
              value={formData.PlayerLevel}
              onChange={handleChange}
              min="0"
              step="1"
              style={{ borderColor: errors.PlayerLevel ? "#ff6b6b" : undefined }}
            />
            {errors.PlayerLevel && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>{errors.PlayerLevel}</p>}
          </div>

          <div>
            <input
              type="number"
              name="AchievementsUnlocked"
              placeholder="Numero di traguardi sbloccati"
              value={formData.AchievementsUnlocked}
              onChange={handleChange}
              min="0"
              step="1"
              style={{ borderColor: errors.AchievementsUnlocked ? "#ff6b6b" : undefined }}
            />
            {errors.AchievementsUnlocked && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>{errors.AchievementsUnlocked}</p>}
          </div>

          <select name="EngagementLevel" value={formData.EngagementLevel} onChange={handleChange} required>
            <option value="" disabled>Coinvolgimento</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit">Salva giocatore</button>
        </form>
      ) : (
        /* Mostra SOLO la tabella quando il giocatore è stato creato */
        <div style={{ 
          marginTop: "2rem", 
          padding: "1.5rem", 
          backgroundColor: "rgba(0, 196, 180, 0.1)", 
          borderRadius: "8px",
          border: "2px solid #00c4b4"
        }}>
          <h3 style={{ color: "#00c4b4", marginBottom: "1rem" }}>
            Giocatore creato con successo!
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
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.PlayerID}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.Age}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.Gender}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.Location}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.PlayerLevel}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.AchievementsUnlocked}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{createdPlayer.EngagementLevel}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button 
            onClick={() => setCreatedPlayer(null)}
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
            Crea un altro giocatore
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerForm;