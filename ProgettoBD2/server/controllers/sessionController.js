const Session = require("../models/sessionModel");

// --- Funzione helper per generare il prossimo SessionID numerico ---
async function getNextSessionID() {
  try {
    const sessions = await Session.find({}, { SessionID: 1, _id: 0 }).lean();
    
    if (!sessions || sessions.length === 0) {
      return 20000; // ← NUMERO invece di "20000"
    }

    const sessionIDs = sessions.map(s => s.SessionID);
    const maxID = Math.max(...sessionIDs);
    return maxID + 1; // ← NUMERO invece di String(maxID + 1)
  } catch (error) {
    console.error("Errore nella generazione del SessionID:", error);
    throw error;
  }
}

// --- CREATE: aggiunge una nuova sessione ---
exports.createSession = async (req, res) => {
  try {
    // Genera automaticamente il SessionID numerico
    const sessionID = await getNextSessionID();
    
    const newSession = new Session({
      ...req.body,
      SessionID: sessionID
    });
    
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- GET con paginazione e ordinamento ---
exports.getSessionsPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const parsedLimit = Math.min(parseInt(limit), 50);

    const sessions = await Session.find()
      .sort({ SessionID: 1 }) // ← Ordinamento numerico automatico
      .skip((page - 1) * parsedLimit)
      .limit(parsedLimit);

    const total = await Session.countDocuments();

    res.json({
      total,
      page: parseInt(page),
      limit: parsedLimit,
      data: sessions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- READ: GET per singolo SessionID ---
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ SessionID: req.params.id });
    if (!session) {
      return res.status(404).json({ message: "Sessione non trovata" });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- UPDATE: modifica una sessione esistente ---
exports.updateSession = async (req, res) => {
  try {
    // Rimuovi SessionID dai dati da aggiornare per evitare modifiche accidentali
    const { SessionID, ...updateData } = req.body;
    
    const session = await Session.findOneAndUpdate(
      { SessionID: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Sessione non trovata" });
    }

    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- DELETE: rimuove una sessione ---
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ SessionID: req.params.id });

    if (!session) {
      return res.status(404).json({ message: "Sessione non trovata" });
    }

    res.json({ message: "Sessione eliminata con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};