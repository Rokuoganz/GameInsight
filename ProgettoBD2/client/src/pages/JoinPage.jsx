import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Layout.css";

export default function JoinPage() {
  const [genreByGender, setGenreByGender] = useState([]);
  const [activityByLocation, setActivityByLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChart1, setShowChart1] = useState(false);
  const [showChart2, setShowChart2] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreResponse, activityResponse] = await Promise.all([
          axios.get("/api/join/genre-by-gender"),
          axios.get("/api/join/activity-by-location"),
        ]);

        setGenreByGender(genreResponse.data);
        setActivityByLocation(activityResponse.data);

      } catch (err) {
        setError("Errore nel recupero dei dati combinati");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Caricamento dati...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }} className="page-container management-container">
      <h1>Analisi Dati</h1>
      <p>Visualizzazione grafici analitici basati sui dati combinati tra giocatori e sessioni.</p>

      {/* Sezione Grafici */}
      <div style={{ marginTop: "30px" }}>
        {/* Grafico 1: Generi di gioco per genere del giocatore */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            onClick={() => setShowChart1(!showChart1)}
            style={{
              cursor: "pointer",
              color: "#007bff",
              textDecoration: "underline",
            }}
          >
            {showChart1 ? "▼" : "▶"} Distribuzione Generi di Gioco per Genere del Giocatore
          </h3>
          {showChart1 && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={genreByGender}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gameGenre" tick={{ fill: "white" }} />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#4A90E2" name="Maschi" />
                <Bar dataKey="Female" fill="#E24A90" name="Femmine" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Grafico 2: Attività di gioco per paese (combinato) */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            onClick={() => setShowChart2(!showChart2)}
            style={{
              cursor: "pointer",
              color: "#007bff",
              textDecoration: "underline",
            }}
          >
            {showChart2 ? "▼" : "▶"} Attività di Gioco per Paese
          </h3>
          {showChart2 && (
            <>
              <p style={{ fontSize: "0.9em", color: "#f1e6e6ff", marginTop: "10px", marginBottom: "15px" }}>
                Confronto tra numero medio di sessioni settimanali e durata media delle sessioni per paese
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={activityByLocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" tick={{ fill: "white" }} />
                  <YAxis yAxisId="left" tick={{ fill: "white" }} orientation="left" stroke="#8884d8" label={{ value: 'Sessioni/settimana', angle: -90, position: 'insideLeft', style: { fill: "#8884d8" } }} />
                  <YAxis yAxisId="right" tick={{ fill: "white" }} orientation="right" stroke="#82ca9d" label={{ value: 'Durata (min)', angle: 90, position: 'insideRight', style: {fill: "#82ca9d"}}} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="avgSessionsPerWeek"
                    fill="#8884d8"
                    name="Sessioni/settimana (media)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="avgDuration"
                    fill="#82ca9d"
                    name="Durata sessione (min)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}