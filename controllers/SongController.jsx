import Songs from "../models/SongModel.jsx";

async function createSongs(req, res) {
  try{
    const { name, email, gender, password } = req.body;
    const encryptPassword = await bcrypt.hash(password, 5);
    await User.create({
        name: name,
        email: email,
        gender: gender,
        password: encryptPassword
        
    });
    res.status(201).json({msg:"Register Berhasil"});
} catch(error){
    console.log(error.message);
}
}