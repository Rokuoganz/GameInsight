const express = require("express");
const router = express.Router();
const controller = require("../controllers/playerController");

// --- CREATE ---
router.post("/", controller.createPlayer);

// --- READ (tutti, con paginazione) ---
router.get("/", controller.getPlayersPaginated);

// --- READ (singolo player per PlayerID) ---
router.get("/:id", controller.getPlayerById);

// --- UPDATE ---
router.put("/:id", controller.updatePlayer);

// --- DELETE ---
router.delete("/:id", controller.deletePlayer);

module.exports = router;

