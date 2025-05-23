import Playlist from "../models/PlaylistModel.js";
import sequelize from "../config/Database.js";
import Songs from "../models/SongModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET
async function getPlaylist(req, res) {
  try {
    const response = await Playlist.findAll();
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// GET BY ID
async function getPlaylistByUserId(req, res) {
  try {
    const response = await Playlist.findAll({ where: { id_user: req.params.id_user } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function getPlaylistWithSongs(req, res) {
  try {
    const { id_playlist } = req.params;

    const query = `
      SELECT p.Playlistname, s.id AS song_id, s.name AS song_name, s.artist, s.duration
      FROM playlist p
      JOIN songs s ON p.id_song = s.id
      WHERE p.id_playlist = :id_playlist
    `;

    const playlists = await sequelize.query(query, {
      replacements: { id_playlist },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ msg: "Playlist tidak ditemukan atau belum ada lagu" });
    }

    // Kelompokkan lagu berdasarkan Playlistname (meskipun 1 playlist, tetap array)
    const groupedPlaylists = playlists.reduce((acc, playlist) => {
      const { Playlistname, song_id, song_name, artist, duration } = playlist;
      if (!acc[Playlistname]) {
        acc[Playlistname] = {
          Playlistname,
          songs: [],
        };
      }
      acc[Playlistname].songs.push({ id: song_id, name: song_name, artist, duration });
      return acc;
    }, {});

    const result = Object.values(groupedPlaylists);

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

// REGISTER //baru nambahin pasword dan bcrypt
async function createPlaylist(req, res) {
  try {
    const { playlist_name } = req.body;
    const id_user = req.user.id;

    if (!playlist_name) {
      return res.status(400).json({ msg: "Playlist name harus diisi" });
    }

    const existingPlaylist = await Playlist.findOne({
      where: {
        Playlistname: playlist_name,
        id_user: id_user,
      },
    });

    if (existingPlaylist) {
      return res.status(400).json({ msg: "Playlist dengan nama ini sudah ada" });
    }

    // Buat playlist baru tanpa id_playlist
    const newPlaylist = await Playlist.create({
      Playlistname: playlist_name,
      id_user: id_user,
    });

    // Gabungkan id utama (primary key) dan playlistname
    const id_playlist = `${newPlaylist.id_user}_${playlist_name.replace(/\s+/g, '_')}`;

    // Update playlist dengan id_playlist yang baru
    await newPlaylist.update({ id_playlist });

    res.status(201).json({ msg: "Playlist berhasil dibuat", playlist: newPlaylist });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

//baru nambahin case password
async function updatePlaylist(req, res) {
  try {
    const { playlist_name } = req.body;
    const { id_playlist } = req.params;

    if (!playlist_name) {
      return res.status(400).json({ msg: "Playlist name harus diisi" });
    }

    // Cari playlist berdasarkan id_playlist
    const playlist = await Playlist.findOne({ where: { id_playlist } });
    if (!playlist) {
      return res.status(404).json({ msg: "Playlist tidak ditemukan" });
    }

    // Update nama playlist
    playlist.Playlistname = playlist_name;

    // Update id_playlist dengan format baru
    playlist.id_playlist = `${playlist.id_user}_${playlist_name.replace(/\s+/g, '_')}`;

    await playlist.save();

    res.status(200).json({ msg: "Playlist berhasil diupdate", playlist });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

async function deletePlaylist(req, res) {
  try {
    const { id_playlist } = req.params;
    const deleted = await Playlist.destroy({ where: { id_playlist } });

    if (deleted === 0) {
      return res.status(404).json({ msg: "Playlist tidak ditemukan" });
    }

    res.status(200).json({ msg: "Playlist Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}


async function addSongToPlaylist(req, res) {
  try {
    const { id_playlist, id_song } = req.params;

    // Validasi input
    if (!id_playlist || !id_song) {
      return res.status(400).json({ msg: "id_playlist dan id_song harus diisi" });
    }

    // Cek apakah playlist ada
    const playlist = await Playlist.findOne({ where: { id_playlist } });
    if (!playlist) {
      return res.status(404).json({ msg: "Playlist tidak ditemukan" });
    }

    // Cek apakah lagu sudah ada di playlist
    const existingSong = await Playlist.findOne({
      where: { id_playlist, id_song },
    });
    if (existingSong) {
      return res.status(400).json({ msg: "Lagu sudah ada di playlist ini" });
    }

    // Tambahkan lagu ke playlist
    await Playlist.create({
      id_playlist,
      id_user: playlist.id_user,
      Playlistname: playlist.Playlistname,
      id_song,
    });

    // Ambil detail lagu dari tabel song
    const song = await Songs.findByPk(id_song);

    res.status(201).json({
      msg: "Lagu berhasil ditambahkan ke playlist",
      song,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

async function removeSongtoPlaylist(req, res) {
  try {
    const { id_playlist, id_song } = req.params;

    // Cek apakah playlist ada
    const playlist = await Playlist.findOne({ where: { id_playlist } });
    if (!playlist) {
      return res.status(404).json({ msg: "Playlist tidak ditemukan" });
    }

    // Hapus lagu dari playlist (hanya baris yang sesuai)
    const deleted = await Playlist.destroy({
      where: {
        id_playlist,
        id_song,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ msg: "Lagu tidak ditemukan di playlist ini" });
    }

    res.status(200).json({ msg: "Lagu berhasil dihapus dari playlist" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

export { removeSongtoPlaylist, addSongToPlaylist, getPlaylist, getPlaylistByUserId, getPlaylistWithSongs, createPlaylist, updatePlaylist, deletePlaylist};
