import express from "express";
import { createPlaylist, getPlaylist, getPlaylistByUserId, getPlaylistWithSongs, updatePlaylist, deletePlaylist } from "../controllers/PlaylistController.js";
const router = express.Router();

// CREATE
router.post("/create-playlist", createPlaylist);

// READ
router.get("/playlist", getPlaylist);
router.get("/playlist/:id_user", getPlaylistByUserId);
router.get("/playlist-with-songs/:id_user", getPlaylistWithSongs);


// UPDATE
router.put("/edit-playlist/:id", updatePlaylist);

// DELETE
router.delete("/delete-playlist/:id", deletePlaylist);

export default router;