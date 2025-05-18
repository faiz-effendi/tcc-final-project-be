import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import SongRoute from "./routes/SongRoute.js";
import PlaylistRoute from "./routes/PlaylistRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import setupAssociations from "./association.js"; // Import the setupAssociations function

const app = express();
app.set("view engine", "ejs");

dotenv.config();

setupAssociations(); // Set up associations between models
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.get("/", (req, res) => res.render("index"));
app.use(UserRoute);
app.use(SongRoute);
app.use(PlaylistRoute);

app.listen(5000, () => console.log("Server connected"));