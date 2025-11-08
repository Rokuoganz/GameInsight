const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

// --- CREATE ---
router.post("/", controller.createSession);

// --- READ (tutti, con paginazione) ---
router.get("/", controller.getSessionsPaginated);

// --- READ (singolo sessione per SessionID) ---
router.get("/:id", controller.getSessionById);

// --- UPDATE ---
router.put("/:id", controller.updateSession);

// --- DELETE ---
router.delete("/:id", controller.deleteSession);

module.exports = router;

