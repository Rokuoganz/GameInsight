import React, { useEffect, useState } from "react";
import { deleteSession } from "../api/sessionApi";
import { useSubmitStatus } from "../utils/useSubmitStatus";
import StatusMessage from "../utils/StatusMessage";

function SessionList({ showDeleteButton = false }) {
  const [sessions, setSessions] = useState([]);
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
  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sessions?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Errore nella richiesta al server");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setSessions(data.data);
        const pages = Math.ceil(data.total / data.limit);
        setTotalPages(pages);
      } else {
        setSessions([]);
        setTotalPages(1);
      }
      setIsSearching(false);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
      setError("Errore nel caricamento delle sessioni");
    } finally {
      setLoading(false);
    }
  };

  // --- RICERCA per SessionID ---
  const handleSearch = async () => {
    const trimmed = searchId.trim();
    if (!trimmed) {
      setPage(1);
      setIsSearching(false);
      setError("");
      fetchSessions();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const encodedId = encodeURIComponent(trimmed);
      const res = await fetch(`/api/sessions/${encodedId}`);

      if (res.status === 404) {
        setError(`Sessione con ID "${trimmed}" non trovata`);
        setSessions([]);
        setIsSearching(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`Errore del server: ${res.status}`);
      }

      const data = await res.json();
      setSessions([data]);
      setIsSearching(true);
    } catch (err) {
      console.error("Errore nella ricerca:", err);
      setError("Errore durante la ricerca della sessione");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // --- ELIMINAZIONE ---
  const handleDelete = async (sessionId) => {
    if (!window.confirm(`Sei sicuro di voler eliminare la sessione ${sessionId}?`)) {
      return;
    }

    clearMessages();

    try {
      await deleteSession(sessionId);
      showSuccess("Sessione eliminata con successo!");

      // Ricarica la lista
      if (isSearching) {
        setSearchId("");
        setIsSearching(false);
      }
      fetchSessions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Errore nell'eliminazione della sessione";
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
    if (!isSearching) fetchSessions();
  }, [page]);

  return (
    <div className="page-container">
      <h2 style={{ textAlign: "center", marginTop: "1rem" }}>Lista Sessioni</h2>
     
      <StatusMessage submitMessage={submitMessage} submitError={submitError} />

      {/* Barra di ricerca */}
      <div className="search-bar" style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Cerca per SessionID..."
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
              fetchSessions();
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
                  <th style={{ padding: "0.75rem" }}>SessionID</th>
                  <th style={{ padding: "0.75rem" }}>PlayerID</th>
                  <th style={{ padding: "0.75rem" }}>PlayTimeHours</th>
                  <th style={{ padding: "0.75rem" }}>InGamePurchases</th>
                  <th style={{ padding: "0.75rem" }}>SessionsPerWeek</th>
                  <th style={{ padding: "0.75rem" }}>AvgSessionDurationMinutes</th>
                  <th style={{ padding: "0.75rem" }}>GameGenre</th>
                  <th style={{ padding: "0.75rem" }}>GameDifficulty</th>
                  {showDeleteButton && <th style={{ padding: "0.75rem" }}>Azioni</th>}
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map((s) => (
                    console.log(s.GameDifficulty),
                    <tr key={s._id || s.SessionID} style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "0.5rem" }}>{s.SessionID}</td>
                      <td style={{ padding: "0.5rem" }}>{s.PlayerID}</td>
                      <td style={{ padding: "0.5rem" }}>{s.PlayTimeHours}</td>
                      <td style={{ padding: "0.5rem" }}>{s.InGamePurchases ? "Sì" : "No"}</td>
                      <td style={{ padding: "0.5rem" }}>{s.SessionsPerWeek}</td>
                      <td style={{ padding: "0.5rem" }}>{s.AvgSessionDurationMinutes}</td>
                      <td style={{ padding: "0.5rem" }}>{s.GameGenre}</td>
                      <td style={{ padding: "0.5rem" }}>{s.GameDifficulty}</td>
                      {showDeleteButton && (
                        <td style={{ padding: "0.5rem" }}>
                          <button
                            onClick={() => handleDelete(s.SessionID)}
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
                    <td colSpan={showDeleteButton ? "9" : "8"} style={{ padding: "1rem" }}>
                      Nessuna sessione trovata.
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

export default SessionList;