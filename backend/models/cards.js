const mongoose = require("mongoose");
const { urlRegex } = require("../utils/utils");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede exceder 30 caracteres"],
      required: [true, "El campo 'name' es obligatorio"],
    },
    link: {
      type: String,
      required: [true, "El campo 'link' es obligatorio"],
      validate: {
        validator: (v) => urlRegex.test(v),
        message: (props) => `${props.value} no es una URL válida`,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "El campo 'owner' es obligatorio"],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("card", cardSchema);
