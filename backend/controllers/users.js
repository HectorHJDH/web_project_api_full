const User = require("../../../../Sprint 15/web_project_around_express/models/user");

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
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    });
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
