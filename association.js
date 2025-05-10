import Playlist from "./models/PlaylistModel.js";
import Users from "./models/UserModel.js";
import Songs from "./models/SongModel.js";

// Definisikan relasi antara Playlist dan Users
Playlist.belongsTo(Users, { foreignKey: "id_user" });
Users.hasMany(Playlist, { foreignKey: "id_user" });

// Definisikan relasi antara Playlist dan Songs
Playlist.belongsTo(Songs, { foreignKey: "id_song" });
Songs.hasMany(Playlist, { foreignKey: "id_song" });

export default function setupAssociations() {
  console.log("Associations have been set up!");
}