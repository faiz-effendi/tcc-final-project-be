import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const User = db.define(
  "users", // Nama Tabel
  {  
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto increment untuk primary key
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    refresh_token: Sequelize.TEXT
  },{
    freezeTableName : true,
    timestamps: false // menonaktifkan auto create createdAt dan updatedAt
}
);

db.sync().then(() => console.log("users table synced"));

export default User;