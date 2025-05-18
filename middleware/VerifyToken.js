import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", req.headers['authorization']);
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token received:", token);

  if (token == null) return res.sendStatus(401); // Jika token tidak ada, kirim status 401

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return res.sendStatus(403); // Jika token tidak valid, kirim status 403
    }

    console.log("Decoded token:", decoded); // Debugging: Periksa isi token yang ter-decode
    req.user = decoded; // Simpan data user dari token ke req.user
    next(); // Lanjutkan ke handler berikutnya
  });
};