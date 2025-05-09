import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel songs
const Songs = db.define('Song', {
  ID_song: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING, // varchar(255)
    allowNull: true
  },
  artist: {
    type: Sequelize.STRING, // varchar(255)
    allowNull: true
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING, // varchar(255)
    allowNull: true
  },
  url: {
    type: Sequelize.STRING, // varchar(255)
    allowNull: true
  }
}, {
  tableName: 'songs', // penting kalau nama tabel kamu bukan plural otomatis
  timestamps: false   // karena di tabel kamu gak ada createdAt/updatedAt
});

db.sync().then(() => console.log("Database synced"));

export default Songs;