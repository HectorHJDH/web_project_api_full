// utils/validate.js
const validator = require("validator");

/**
 * Valida que un valor sea una URL usando validator.isURL.
 * Si no lo es, devuelve un error de tipo 'string.uri' para que
 * Celebrate/Joi lo maneje igual que su validador nativo.
 */
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports = { validateURL };
