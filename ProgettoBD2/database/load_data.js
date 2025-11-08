const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

mongoose.connect('mongodb://localhost:27017/online_gaming');

const importCSV = async (path, collectionName) => {
  const schema = new mongoose.Schema({}, { strict: false });
  const Model = mongoose.model(collectionName + '_import_' + Date.now(), schema, collectionName);

  await Model.deleteMany({});
  console.log(`🗑️  ${collectionName} svuotata`);

  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        // Converti manualmente i tipi per Players
        if (collectionName === 'players') {
          row.PlayerID = parseInt(row.PlayerID, 10);
          row.Age = parseInt(row.Age, 10);
          row.PlayerLevel = parseInt(row.PlayerLevel, 10);
          row.AchievementsUnlocked = parseInt(row.AchievementsUnlocked, 10);
        }
        
        // Converti manualmente i tipi per Sessions
        if (collectionName === 'sessions') {
          row.SessionID = parseInt(row.SessionID, 10);
          row.PlayerID = parseInt(row.PlayerID, 10);
          row.PlayTimeHours = parseFloat(row.PlayTimeHours);
          row.SessionsPerWeek = parseInt(row.SessionsPerWeek, 10);
          row.AvgSessionDurationMinutes = parseInt(row.AvgSessionDurationMinutes, 10);
          row.InGamePurchases = row.InGamePurchases === 'True' || row.InGamePurchases === 'true';
        }
        
        rows.push(row);
      })
      .on('end', async () => {
        try {
          await Model.insertMany(rows);
          console.log(`✅ ${collectionName} importata (${rows.length} documenti)`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
};

(async () => {
  try {
    console.log('🔄 Avvio importazione...');
    await importCSV('../data_preprocessing/Player.csv', 'players');
    await importCSV('../data_preprocessing/Session.csv', 'sessions');
    console.log('🎉 Importazione completata!');
  } catch (error) {
    console.error('❌ Errore durante l\'importazione:', error.message);
    console.error('\n⚠️  Verifica che MongoDB sia in esecuzione!');
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();