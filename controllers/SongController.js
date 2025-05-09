import Songs from "../models/SongModel.js";

async function createSong(req, res) {
  try{
    const { name, artist, duration, image, url } = req.body;
    await Songs.create({
      name: name,
      artist: artist,
      duration: duration,
      image: image,
      url: url,
    });
    res.status(201).json({msg:"Song table created"});
} catch(error){
  res.status(400).json({ msg: "Error to create song" });
}
}

async function getSongs(req, res) {
  try {
    const response = await Songs.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ msg: "Error to fetch all songs" });
  }
}

async function getSongById(req, res) {
  try {
    const response = await Songs.findOne({ where: {id: req.params.id} });
    if(!response) {
      return res.status(404).json({ msg: "Song not found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(400).json({ msg: "Error to fetch song by id" });
  }
}

async function updateSong(req, res) {
  try {
    const { id } = req.params;
    const { name, artist, duration, image, url } = req.body;

    if(!id) {
      res.status(400).json({ msg: "ID cant be empty" });
    } else {
      const oldData = await Songs.findOne({ where: { id: id } });
      if(!oldData) {
        res.status(400).json({ msg: "Song ID is not found" })
      } else {
        // Supaya data tidak null
        const newData = {
          name: name || oldData.name, 
          artist: artist || oldData.artist, 
          duration: duration || oldData.duration, 
          image: image || oldData.image, 
          url: url || oldData.url, 
        }
    
        await Songs.update(newData, { where: { id: id } });
        res.status(200).json({ msg: "Successfully updated song" });
      }
    }



  } catch (error) {
    res.status(400).json({ msg: "Error in updating song" });
  }
}

async function deleteSong(req, res) {
  try {
    await Songs.destroy({ where: { id: req.params.id } });
    res.status(200).json({ msg: "Successfully deleted song" });
  } catch(error) {
    res.status(400).json({ msg: "Error to delete song" });
  }
}

export { createSong, getSongs, getSongById, deleteSong, updateSong };