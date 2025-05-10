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
    const { id_user } = req.params;

    const query = `
      SELECT p.Playlistname, s.id AS song_id, s.name AS song_name, s.artist, s.duration
      FROM playlist p
      JOIN songs s ON p.id_song = s.id
      WHERE p.id_user = :id_user
    `;

    const playlists = await sequelize.query(query, {
      replacements: { id_user: id_user },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ msg: "Playlist tidak ditemukan untuk user ini" });
    }

    // Kelompokkan lagu berdasarkan Playlistname
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

    // Ubah hasil menjadi array
    const result = Object.values(groupedPlaylists);

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
}

// REGISTER //baru nambahin pasword dan bcrypt
async function createPlaylist(req, res) {
  try{
    const { Playlistname } = req.body;
    await Playlist.create({
        Playlistname: Playlistname,
    });
    res.status(201).json({msg:"playlist Berhasil dibuat"});
} catch(error){
    console.log(error.message);
}
}

//baru nambahin case password
async function updatePlaylist(req, res) {
  try{
    const { email } = req.body;
    let updatedData = {
      email
    }; //nyimpen jadi object

    if (password) {
        const encryptPassword = await bcrypt.hash(password, 5);
        updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, {
        where: {
            id: req.params.id
        }
    });

    // Periksa apakah ada baris yang terpengaruh (diupdate)
    if (result[0] === 0) {
        return res.status(404).json({
            status: 'failed',
            message: 'User tidak ditemukan atau tidak ada data yang berubah',
            updatedData: updatedData,
            result
        });
    }


    
    res.status(200).json({msg:"User Updated"});
  } catch(error){
    console.log(error.message);
  }
}

async function deletePlaylist(req, res) {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(201).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
}


export { getPlaylist, getPlaylistByUserId, getPlaylistWithSongs, createPlaylist, updatePlaylist, deletePlaylist};
