const mongoose = require("mongoose");

const { urlRegex } = require("../utils/utils");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: [true, "El campo ‘name’ es obligatorio"],
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: [true, "El campo ‘about’ es obligatorio"],
    },
    avatar: {
      type: String,
      required: [true, "El campo ‘avatar’ es obligatorio"],
      validate: {
        validator: (v) => urlRegex.test(v),
        message: (props) => `${props.value} no es una URL válida`,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
