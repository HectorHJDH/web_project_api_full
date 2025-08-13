// middlewares/auth.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { JWT_SECRET = "some-secret-key" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log("Authorization header: ", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Autorización requerida" });
  }

  const token = authorization.replace("Bearer ", "");
  console.log(token);

  let payload;
  try {
    // console.log("Payload: ", payload);

    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // console.log("error: ", err);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }

  req.user = payload; // { _id: ... }
  next();
};
