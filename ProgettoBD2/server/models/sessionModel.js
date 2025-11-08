const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  SessionID: { 
    type: Number,  // ← CAMBIATO DA String A Number
    required: true, 
    unique: true 
  },
  PlayerID: { 
    type: Number,  // ← CAMBIATO DA String A Number
    required: true 
  },
  PlayTimeHours: { 
    type: Number,
    min: [0, "Le ore di gioco devono essere positive"]
  },
  InGamePurchases: Boolean,
  SessionsPerWeek: { 
    type: Number,
    min: [1, "Le sessioni settimanali devono essere almeno 1"],
    validate: {
      validator: Number.isInteger,
      message: "Le sessioni settimanali devono essere un numero intero"
    }
  },
  AvgSessionDurationMinutes: { 
    type: Number,
    min: [1, "La durata media deve essere almeno 1 minuto"]
  },
  GameGenre: String,
  GameDifficulty: String
}, {
  collection: 'sessions'
});

module.exports = mongoose.model("Session", sessionSchema);