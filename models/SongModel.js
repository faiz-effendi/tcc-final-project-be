import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const Songs = db.define(
  "songs", // Nama Tabel
  {
    name: Sequelize.STRING,
    artist: Sequelize.STRING,
    duration: Sequelize.INTEGER,
    image: Sequelize.STRING,
    url: Sequelize.STRING,
  },{
    freezeTableName : true,
    timestamps: false // menonaktifkan auto create createdAt dan updatedAt
}
);

db.sync().then(() => console.log("songs table synced"));

export default Songs;