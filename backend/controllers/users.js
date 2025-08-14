require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = process.env;

// Devuelve todos los usuarios
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(next);
};

// Devuelve un usuario por su ID
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      next(err);
    });
};

// Crea un nuevo usuario
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json(userObj);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    // Duplicado de email
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con ese email" });
    }
    next(err);
  }
};

// Controlador de login
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me — actualizar el perfil (name y about)
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      orFail: () => {
        const err = new Error("Usuario no encontrado");
        err.statusCode = 404;
        throw err;
      },
    }
  )
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    });
};

// PATCH /users/me/avatar — actualizar el avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      orFail: () => {
        const err = new Error("Usuario no encontrado");
        err.statusCode = 404;
        throw err;
      },
    }
  )
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      next(err);
    });
};
