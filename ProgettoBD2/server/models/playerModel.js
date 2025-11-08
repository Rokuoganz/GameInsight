const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  PlayerID: { 
    type: Number,  // ← CAMBIATO DA String A Number
    required: true, 
    unique: true 
  },
  Age: { 
    type: Number, 
    min: [1, "L'età deve essere almeno 1"],
    validate: {
      validator: Number.isInteger,
      message: "L'età deve essere un numero intero"
    }
  },
  Gender: String,
  Location: String,
  PlayerLevel: { 
    type: Number,
    min: [0, "Il livello deve essere un numero positivo"],
    validate: {
      validator: Number.isInteger,
      message: "Il livello deve essere un numero intero"
    }
  },
  AchievementsUnlocked: { 
    type: Number,
    min: [0, "Il numero di traguardi deve essere positivo"],
    validate: {
      validator: Number.isInteger,
      message: "Il numero di traguardi deve essere un numero intero"
    }
  },
  EngagementLevel: String
}, {
  collection: 'players'
});

module.exports = mongoose.model("Player", playerSchema);