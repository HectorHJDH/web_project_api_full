const mongoose = require("mongoose");
const validator = require("validator");
const { urlRegex } = require("../utils/utils");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Jacques Cousteau",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Explorador",
    },
    avatar: {
      type: String,
      default:
        "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
      validate: {
        validator: (v) => urlRegex.test(v),
        message: (props) => `${props.value} no es una URL válida`,
      },
    },
    email: {
      type: String,
      required: [true, "El campo “email” es obligatorio"],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} no es un correo válido`,
      },
    },
    password: {
      type: String,
      required: [true, "El campo “password” es obligatorio"],
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
