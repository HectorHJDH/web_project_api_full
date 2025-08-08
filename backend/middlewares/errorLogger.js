// middlewares/errorLogger.js
const { logError } = require("../utils/logger");

const maskSensitive = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const copy = JSON.parse(JSON.stringify(obj));
  if (copy.password) copy.password = "[MASKED]";
  return copy;
};

/*
  Error middleware debe tener 4 parámetros (err, req, res, next) para que Express
  lo identifique como middleware de error.
*/
module.exports = (err, req, res, next) => {
  const { method, originalUrl: url } = req;
  const statusCode = err.statusCode || 500;

  const entry = {
    timestamp: new Date().toISOString(),
    event: "error",
    message: err.message,
    statusCode,
    method,
    url,
    body: maskSensitive(req.body),
    headers: {
      authorization: req.headers.authorization ? "[MASKED]" : undefined,
    },
    stack: err.stack,
  };

  // No await para no bloquear; en caso de fallo, no queremos romper la respuesta final
  logError(entry).catch(() => {});

  // Pasamos el error al siguiente middleware (errorHandler) para que responda
  next(err);
};
