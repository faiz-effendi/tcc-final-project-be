import express from "express";
import { createSong, getSongs, getSongById, getSongByName, deleteSong, updateSong } from "../controllers/SongController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// CREATE
router.post("/create-song", createSong);

// READ
router.get("/songs",verifyToken,getSongs);
router.get("/songbyid/:id",verifyToken, getSongById);
router.get("/songbyname/:name",verifyToken, getSongByName);

// UPDATE
router.put("/edit-song/:id",verifyToken, updateSong);

// DELETE
router.delete("/delete-song/:id",verifyToken, deleteSong);

export default router;