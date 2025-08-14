const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const { validateURL } = require("../utils/validate");
const {
  getUsers,
  getUserById,
  getCurrentUser, // <-- importamos el nuevo controlador
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

const router = express.Router();

// GET /users/me — datos del usuario actual
router.get("/me", getCurrentUser);

// Listar todos los usuarios
router.get("/", getUsers);

// Obtener un usuario por ID
router.get(
  "/:userId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);

// PATCH /users/me — actualizar perfil
router.patch(
  "/me",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile
);

// PATCH /users/me/avatar — actualizar avatar
router.patch(
  "/me/avatar",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .custom(validateURL)
        .message("Avatar debe ser una URL válida"),
    }),
  }),
  updateAvatar
);

module.exports = router;
