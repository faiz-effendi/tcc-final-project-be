import sequelize, { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "playlsit"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const Playlist = db.define(
  "playlist", // Nama Tabel
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto increment untuk primary key
    },
    Playlistname: {
      type: Sequelize.STRING,
      allowNull: true, // Playlistname opsional
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: false, // Foreign key ke tabel users
      references: {
        model: Users, // Nama model yang dirujuk
        key: "id", // Kolom di tabel users yang dirujuk
      },
    },
    id_song: {
      type: Sequelize.INTEGER,
      allowNull: false, // Foreign key ke tabel songs
      references: {
        model: Songs, // Nama model yang dirujuk
        key: "id", // Kolom di tabel songs yang dirujuk
      },
    },
  },{
    freezeTableName : true,
    timestamps: false // menonaktifkan auto create createdAt dan updatedAt
}
);

db.sync().then(() => console.log("Database synced"));

export default Playlist;
