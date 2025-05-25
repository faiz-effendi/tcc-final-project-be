import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET
async function getUsers(req, res) {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// GET BY ID
async function getUserById(req, res) {
  try {
    const response = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// REGISTER //baru nambahin pasword dan bcrypt
async function createUser(req, res) {
  try{
    const { email, password } = req.body;
    const encryptPassword = await bcrypt.hash(password, 5);
    await User.create({
        email: email,
        password: encryptPassword
    });
    res.status(201).json({msg:"Register Berhasil"});
} catch(error){
    console.log(error.message);
}
}

//baru nambahin case password
async function updateUser(req, res) {
  try{
    const { email, password} = req.body;

    console.log("Request body:", req.body);
    console.log("Request params:", req.params);

    console.log("email:", email);
    console.log("password:", password);

    // Cek apakah email sudah ada
    let updatedData = {
      email
    }; //nyimpen jadi object

    if (password) {
        const encryptPassword = await bcrypt.hash(password, 5);
        updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, {
        where: {
            id: req.params.id
        }
    });

    // Periksa apakah ada baris yang terpengaruh (diupdate)
    if (result[0] === 0) {
        return res.status(404).json({
            status: 'failed',
            message: 'User tidak ditemukan atau tidak ada data yang berubah',
            updatedData: updatedData,
            result
        });
    }


    
    res.status(200).json({msg:"User Updated"});
  } catch(error){
    console.log(error.message);
  }
}

async function deleteUser(req, res) {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(201).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
}

//Nambah fungsi buat login handler
async function loginHandler(req, res){
  try{
      const{email, password} = req.body;
      const user = await User.findOne({
          where : {
              email: email,
            }
          });
        console.log("email :",user);
        console.log("password :",password);
   
          
      if(user){
        //Data User itu nanti bakalan dipake buat ngesign token kan
        // data user dari sequelize itu harus diubah dulu ke bentuk object
        //Safeuserdata dipake biar lebih dinamis, jadi dia masukin semua data user kecuali data-data sensitifnya  karena bisa didecode kayak password caranya gini :
        const userPlain = user.toJSON(); // Konversi ke object
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;

          const decryptPassword = await bcrypt.compare(password, user.password);
          if(decryptPassword){
              const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn : '8m' 
              });
              const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
                  expiresIn : '1d' 
              });
              await User.update({refresh_token:refreshToken},{
                  where:{
                      id:user.id
                  }
              });
              res.cookie('refreshToken', refreshToken,{
                  httpOnly : true, //ngatur cross-site scripting, untuk penggunaan asli aktifkan karena bisa nyegah serangan fetch data dari website "document.cookies"
                  sameSite : 'none',  //ini ngatur domain yg request misal kalo strict cuman bisa akseske link dari dan menuju domain yg sama, lax itu bisa dari domain lain tapi cuman bisa get
                  maxAge  : 24*60*60*1000,
                  secure: true //ini ngirim cookies cuman bisa dari https, kenapa? nyegah skema MITM di jaringan publik, tapi pas development di false in aja
              });
              res.status(200).json({
                  status: "Succes",
                  message: "Login Berhasil",
                  safeUserData,
                  accessToken 
              });
          }
          else{
              res.status(400).json({
                  status: "Failed",
                  message: "Paassword atau email salah",
                
              });
          }
      } else{
          res.status(400).json({
              status: "Failed",
              message: "Paassword atau email salah",
          });
      }
  } catch(error){
      res.status(error.statusCode || 500).json({
          status: "error",
          message: error.message
      })
  }
}

//nambah logout
async function logout(req, res) {
   try {
    const refreshToken = req.cookies.refreshToken; // 
    // Sesuaikan nama cookie
    console.log("refreshToken dari cookie:", req.cookies.refreshToken);
    if (!refreshToken) return res.sendStatus(204); // No Content, berarti user sudah logout

    // User Validation
    const data = await User.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!data) return res.status(204).json("User Tidak Ditemukan");

    // Mengupdate refresh token menjadi null
    await User.update({ refresh_token: null }, { where: { id: data.id } });

    // Menghapus refresh cookie
    res.clearCookie("refreshToken",{
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }); // Sesuaikan nama cookie

    // Response
    return res.status(200).json({
      message: "Logout Berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
}
export { getUsers, getUserById, createUser, updateUser, deleteUser,loginHandler, logout};
