import express from "express";
import { createSong, getSongs, getSongById, deleteSong, updateSong } from "../controllers/SongController.js";
import {verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// CREATE
router.post("/create-song", createSong);

// READ
router.get("/songs",getSongs);
router.get("/song/:id", getSongById);

// UPDATE
router.put("/edit-song/:id", updateSong);

// DELETE
router.delete("/delete-song/:id", deleteSong);

export default router;