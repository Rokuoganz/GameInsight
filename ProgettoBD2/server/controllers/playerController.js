const Player = require("../models/playerModel");

// --- Funzione helper per generare il prossimo PlayerID numerico ---
async function getNextPlayerID() {
  try {
    const players = await Player.find({}, { PlayerID: 1, _id: 0 }).lean();
    
    if (!players || players.length === 0) {
      return 10000; // ← NUMERO invece di "10000"
    }

    // Ora PlayerID è già un numero, non serve più parseInt
    const playerIDs = players.map(p => p.PlayerID);
    const maxID = Math.max(...playerIDs);
    return maxID + 1; // ← NUMERO invece di String(maxID + 1)
  } catch (error) {
    console.error("Errore nella generazione del PlayerID:", error);
    throw error;
  }
}

// --- CREATE: aggiunge un nuovo giocatore ---
exports.createPlayer = async (req, res) => {
  try {
    // Genera automaticamente il PlayerID numerico
    const playerID = await getNextPlayerID();
    
    const newPlayer = new Player({
      ...req.body,
      PlayerID: playerID
    });
    
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- GET con paginazione e ordinamento ---
exports.getPlayersPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const parsedLimit = Math.min(parseInt(limit), 50);

    // Ora l'ordinamento funziona direttamente!
    const players = await Player.find()
      .sort({ PlayerID: 1 }) // ← Ordinamento numerico automatico
      .skip((page - 1) * parsedLimit)
      .limit(parsedLimit);

    const total = await Player.countDocuments();

    res.json({
      total,
      page: parseInt(page),
      limit: parsedLimit,
      data: players,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- READ: GET per singolo PlayerID ---
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findOne({ PlayerID: req.params.id });
    if (!player) {
      return res.status(404).json({ message: "Giocatore non trovato" });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- UPDATE: modifica un giocatore esistente ---
exports.updatePlayer = async (req, res) => {
  try {
    // Rimuovi PlayerID dai dati da aggiornare per evitare modifiche accidentali
    const { PlayerID, ...updateData } = req.body;
    
    const player = await Player.findOneAndUpdate(
      { PlayerID: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ message: "Giocatore non trovato" });
    }

    res.json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- DELETE: rimuove un giocatore ---
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findOneAndDelete({ PlayerID: req.params.id });

    if (!player) {
      return res.status(404).json({ message: "Giocatore non trovato" });
    }

    res.json({ message: "Giocatore eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};