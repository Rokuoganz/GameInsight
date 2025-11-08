const Session = require("../models/sessionModel");
const Player = require("../models/playerModel");

const getJoinedData = async (_req, res) => {
  try {
    // 🔍 TEST DIAGNOSTICO
    const testSession = await Session.findOne();
    console.log("📋 Esempio Session:", testSession);
    
    const testPlayer = await Player.findOne();
    console.log("📋 Esempio Player:", testPlayer);
    
    // Verifica il tipo di PlayerID
    console.log("🔍 Tipo PlayerID in Session:", typeof testSession?.PlayerID);
    console.log("🔍 Tipo PlayerID in Player:", typeof testPlayer?.PlayerID);
    console.log("🔍 Valori PlayerID:", {
      session: testSession?.PlayerID,
      player: testPlayer?.PlayerID
    });

    const joinData = await Session.aggregate([
      {
        $lookup: {
          from: "players",
          localField: "PlayerID",
          foreignField: "PlayerID",
          as: "playerData",
        },
      },
      { $unwind: "$playerData" },
      {
        $project: {
          _id: 0,
          playerID: "$playerData.PlayerID",
          age: "$playerData.Age",
          gender: "$playerData.Gender",
          location: "$playerData.Location",
          playerLevel: "$playerData.PlayerLevel",
          achievements: "$playerData.AchievementsUnlocked",
          engagement: "$playerData.EngagementLevel",
          gameTitle: "$GameGenre",
          duration: "$AvgSessionDurationMinutes",
          hours: "$PlayTimeHours",
        },
      },
    ]);

    console.log("✅ Numero di record:", joinData.length);
    if (joinData.length > 0) {
      console.log("✅ Primo record:", joinData[0]);
    } else {
      console.log("⚠️ Nessun dato trovato nel JOIN");
    }

    res.status(200).json(joinData);
  } catch (err) {
    console.error("❌ Errore nel recupero dei dati combinati:", err);
    res.status(500).json({ error: "Errore nel recupero dei dati combinati" });
  }
};

// Nuovo endpoint: Distribuzione generi di gioco per genere del giocatore
const getGenreByGender = async (_req, res) => {
  try {
    const data = await Session.aggregate([
      {
        $lookup: {
          from: "players",
          localField: "PlayerID",
          foreignField: "PlayerID",
          as: "playerData",
        },
      },
      { $unwind: "$playerData" },
      {
        $group: {
          _id: {
            gameGenre: "$GameGenre",
            gender: "$playerData.Gender",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.gameGenre",
          genderData: {
            $push: {
              gender: "$_id.gender",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          gameGenre: "$_id",
          genderData: 1,
        },
      },
      { $sort: { gameGenre: 1 } },
    ]);

    // Trasformo i dati in un formato più comodo per Recharts
    const formattedData = data.map((item) => {
      const result = { gameGenre: item.gameGenre };
      item.genderData.forEach((gd) => {
        result[gd.gender] = gd.count;
      });
      return result;
    });

    res.status(200).json(formattedData);
  } catch (err) {
    console.error("❌ Errore nel recupero dati genere/genere:", err);
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
};

// Nuovo endpoint: Attività di gioco per paese
const getActivityByLocation = async (_req, res) => {
  try {
    const data = await Session.aggregate([
      {
        $lookup: {
          from: "players",
          localField: "PlayerID",
          foreignField: "PlayerID",
          as: "playerData",
        },
      },
      { $unwind: "$playerData" },
      {
        $match: {
          SessionsPerWeek: { $ne: null },
          AvgSessionDurationMinutes: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$playerData.Location",
          avgSessionsPerWeek: {
            $avg: { $toDouble: "$SessionsPerWeek" },
          },
          avgDuration: {
            $avg: { $toDouble: "$AvgSessionDurationMinutes" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          location: "$_id",
          avgSessionsPerWeek: { $round: ["$avgSessionsPerWeek", 2] },
          avgDuration: { $round: ["$avgDuration", 2] },
        },
      },
      { $sort: { location: 1 } },
    ]);

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Errore nel recupero dati per paese:", err);
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
};


module.exports = { 
  getJoinedData, 
  getGenreByGender, 
  getActivityByLocation 
};