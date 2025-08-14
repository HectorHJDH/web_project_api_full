const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const router = express.Router();

// Obtener todas las tarjetas
router.get("/", getCards);

// Crear una tarjeta
router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  }),
  createCard
);

// Eliminar tarjeta por ID
router.delete(
  "/:cardId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard
);

// Dar like a una tarjeta
router.put(
  "/:cardId/likes",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard
);

// Quitar like a una tarjeta
router.delete(
  "/:cardId/likes",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard
);

module.exports = router;
