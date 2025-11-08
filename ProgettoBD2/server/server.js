const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const playerRoutes = require("./routes/playerRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const joinRoutes = require("./routes/joinRoutes"); // aggiunto

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore di connessione:", err));

app.use("/api/players", playerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/join", joinRoutes); // aggiunto

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
