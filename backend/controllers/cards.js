const Card = require("../models/cards");

// GET /cards — devuelve todas las tarjetas
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(next);
};

// POST /cards — crea una nueva tarjeta
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user && req.user._id;
  if (!owner) {
    return res.status(400).json({ message: "Falta el campo owner" });
  }

  Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    });
};

// DELETE /cards/:cardId — elimina una tarjeta por _id
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: "Tarjeta no encontrada" });
      }
      return Card.findByIdAndRemove(cardId).then(() =>
        res.json({ message: "Tarjeta eliminada correctamente" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      next(err);
    });
};

// PUT /cards/:cardId/likes — dar like
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      orFail: () => {
        const err = new Error("Tarjeta no encontrada");
        err.statusCode = 404;
        throw err;
      },
    }
  )
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      next(err);
    });
};

// DELETE /cards/:cardId/likes — quitar like
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      orFail: () => {
        const err = new Error("Tarjeta no encontrada");
        err.statusCode = 404;
        throw err;
      },
    }
  )
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      next(err);
    });
};
