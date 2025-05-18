import express from "express";
import { createSong, getSongs, getSongById, getSongByName, deleteSong, updateSong } from "../controllers/SongController.js";

const router = express.Router();

// CREATE
router.post("/create-song", createSong);

// READ
router.get("/songs",getSongs);
router.get("/song/:id", getSongById);
router.get("/songs/name/:name", getSongByName);

// UPDATE
router.put("/edit-song/:id", updateSong);

// DELETE
router.delete("/delete-song/:id", deleteSong);

export default router;