import sequelize, { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const Users = db.define(
  "users", // Nama Tabel
  {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    refresh_token: Sequelize.TEXT
  },{
    freezeTableName : true,
    timestamps: false // menonaktifkan auto create createdAt dan updatedAt
}
);

db.sync().then(() => console.log("users table synced"));

export default Users;