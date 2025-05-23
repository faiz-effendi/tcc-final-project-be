import express from "express";
import { createPlaylist, getPlaylist, getPlaylistByUserId, getPlaylistWithSongs, updatePlaylist, deletePlaylist,addSongToPlaylist,removeSongtoPlaylist } from "../controllers/PlaylistController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();


// CREATE
router.post("/create-playlist", verifyToken,createPlaylist);
router.post("/add-song-to-playlist/:id_playlist/:id_song", addSongToPlaylist);

// READ
router.get("/playlist",verifyToken,getPlaylist);
router.get("/playlist/:id_user",verifyToken, getPlaylistByUserId);
router.get("/playlist-with-songs/:id_playlist", verifyToken,getPlaylistWithSongs);

// UPDATE
router.put("/edit-playlist/:id_playlist", verifyToken,updatePlaylist);

// DELETE
router.delete("/delete-playlist/:id_playlist",verifyToken,deletePlaylist);
router.delete("/remove-song-from-playlist/:id_playlist/:id_song", verifyToken,removeSongtoPlaylist);

export default router;