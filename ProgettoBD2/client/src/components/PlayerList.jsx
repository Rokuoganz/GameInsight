import React, { useEffect, useState } from "react";
import { deletePlayer } from "../api/playerApi";
import { useSubmitStatus } from "../utils/useSubmitStatus";
import StatusMessage from "../utils/StatusMessage";

function PlayerList({ showDeleteButton = false }) {
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const limit = 50;

  const { submitMessage, 
      submitError, 
      showSuccess, 
      showError, 
      clearMessages } = useSubmitStatus();

  // --- FETCH con paginazione ---
  const fetchPlayers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/players?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Errore nella richiesta al server");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setPlayers(data.data);
        const pages = Math.ceil(data.total / data.limit);
        setTotalPages(pages);
      } else {
        setPlayers([]);
        setTotalPages(1);
      }
      setIsSearching(false);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
      setError("Errore nel caricamento dei giocatori");
    } finally {
      setLoading(false);
    }
  };

  // --- RICERCA per PlayerID ---
  const handleSearch = async () => {
    const trimmed = searchId.trim();
    if (!trimmed) {
      setPage(1);
      setIsSearching(false);
      setError("");
      fetchPlayers();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const encodedId = encodeURIComponent(trimmed);
      const res = await fetch(`/api/players/${encodedId}`);
      
      if (res.status === 404) {
        setError(`Giocatore con ID "${trimmed}" non trovato`);
        setPlayers([]);
        setIsSearching(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`Errore del server: ${res.status}`);
      }

      const data = await res.json();
      setPlayers([data]);
      setIsSearching(true);
    } catch (err) {
      console.error("Errore nella ricerca:", err);
      setError("Errore durante la ricerca del giocatore");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- ELIMINAZIONE ---
  const handleDelete = async (playerId) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il giocatore ${playerId}?`)) {
      return;
    }

    clearMessages();

    try {
      await deletePlayer(playerId);
      showSuccess("Giocatore eliminato con successo!");
      
      // Ricarica la lista
      if (isSearching) {
        setSearchId("");
        setIsSearching(false);
      }
      fetchPlayers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Errore nell'eliminazione del giocatore";
      showError(`❌ ${errorMessage}`);
      console.error(error);
    }
  };

  // Gestione tasto Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!isSearching) fetchPlayers();
  }, [page]);

  return (
    <div className="page-container">
      <h2 style={{ textAlign: "center", marginTop: "1rem" }}>Lista Giocatori</h2>

      <StatusMessage submitMessage={submitMessage} submitError={submitError} />

      {/* Barra di ricerca */}
      <div className="search-bar" style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Cerca per PlayerID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ padding: "0.5rem", width: "200px", marginRight: "10px" }}
        />
        <button onClick={handleSearch}>Cerca</button>
        {isSearching && (
          <button
            onClick={() => {
              setSearchId("");
              setPage(1);
              setError("");
              setIsSearching(false);
              fetchPlayers();
            }}
            style={{ marginLeft: "10px" }}
          >
            Mostra tutti
          </button>
        )}
      </div>

      {/* Messaggio di errore */}
      {error && (
        <div style={{ 
          textAlign: "center", 
          color: "#ff6b6b", 
          marginBottom: "1rem",
          padding: "0.5rem",
          backgroundColor: "rgba(255, 107, 107, 0.1)",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div style={{ textAlign: "center", margin: "2rem" }}>
          <span style={{ fontSize: "1.5rem" }}>Caricamento...</span>
        </div>
      ) : (
        <>
          {/* Tabella */}
          <div style={{ overflowX: "auto", textAlign: "center" }}>
            <table
              style={{
                margin: "0 auto",
                borderCollapse: "collapse",
                width: "90%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#222", color: "#00c4b4" }}>
                  <th style={{ padding: "0.75rem" }}>PlayerID</th>
                  <th style={{ padding: "0.75rem" }}>Age</th>
                  <th style={{ padding: "0.75rem" }}>Gender</th>
                  <th style={{ padding: "0.75rem" }}>Location</th>
                  <th style={{ padding: "0.75rem" }}>Level</th>
                  <th style={{ padding: "0.75rem" }}>Achievements</th>
                  <th style={{ padding: "0.75rem" }}>Engagement</th>
                  {showDeleteButton && <th style={{ padding: "0.75rem" }}>Azioni</th>}
                </tr>
              </thead>
              <tbody>
                {players.length > 0 ? (
                  players.map((p) => (
                    <tr key={p._id || p.PlayerID} style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "0.5rem" }}>{p.PlayerID}</td>
                      <td style={{ padding: "0.5rem" }}>{p.Age}</td>
                      <td style={{ padding: "0.5rem" }}>{p.Gender}</td>
                      <td style={{ padding: "0.5rem" }}>{p.Location}</td>
                      <td style={{ padding: "0.5rem" }}>{p.PlayerLevel}</td>
                      <td style={{ padding: "0.5rem" }}>{p.AchievementsUnlocked}</td>
                      <td style={{ padding: "0.5rem" }}>{p.EngagementLevel}</td>
                      {showDeleteButton && (
                        <td style={{ padding: "0.5rem" }}>
                          <button
                            onClick={() => handleDelete(p.PlayerID)}
                            style={{
                              backgroundColor: "#ff6b6b",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "0.4rem 0.8rem",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            🗑️ Elimina
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showDeleteButton ? "8" : "7"} style={{ padding: "1rem" }}>
                      Nessun giocatore trovato.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginazione */}
          {!isSearching && totalPages > 1 && (
            <div
              className="pagination"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1rem",
                gap: "1rem",
              }}
            >
              <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                ← Precedente
              </button>
              <span>
                Pagina {page} di {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page >= totalPages}
              >
                Successiva →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PlayerList;