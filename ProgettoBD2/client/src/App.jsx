import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PlayerPage from "./pages/PlayerPage";
import SessionPage from "./pages/SessionPage";
import JoinPage from "./pages/JoinPage";
import HomePage from "./pages/HomePage";
import "./styles/Navbar.css"; 

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/players">Giocatori</Link></li>
          <li><Link to="/sessions">Sessioni</Link></li>
          <li><Link to="/analysis">Analisi</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayerPage />} />
        <Route path="/sessions" element={<SessionPage />} />
        <Route path="/analysis" element={<JoinPage />} />
      </Routes>
    </Router>
  );
}




