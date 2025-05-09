import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const User = db.define('User', {
  ID_user: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING, // varchar(255)
    allowNull: true
  },
  email: {
    type: Sequelize.STRING, // varchar(255)
    allowNull: true
  },
  refresh_token: {
    type: Sequelize.TEXT, // text di MySQL cocok ke TEXT Sequelize
    allowNull: true
  }
}, {
  tableName: 'users', // sesuai nama tabel di database
  timestamps: false   // karena gak ada kolom createdAt dan updatedAt
});

db.sync().then(() => console.log("Database synced"));

export default User;
// export default Songs;
