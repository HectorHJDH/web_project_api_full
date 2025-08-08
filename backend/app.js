// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { errors: celebrateErrors } = require("celebrate");

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const requestLogger = require("./middlewares/requestLogger");
const errorLogger = require("./middlewares/errorLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/aroundb" } =
  process.env;

// Middleware para parsear JSON
app.use(express.json());

// Logger de peticiones
app.use(requestLogger);

// ─── Rutas públicas ────────────────────────────────────────────────────
app.post("/signup", createUser);
app.post("/signin", login);

// ─── Middleware de autorización JWT ────────────────────────────────────
app.use(auth);

// ─── Rutas protegidas por JWT ──────────────────────────────────────────
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// ─── Manejo de rutas no encontradas ────────────────────────────────────
app.use((req, res, next) => {
  const err = new Error("Recurso solicitado no encontrado");
  err.statusCode = 404;
  next(err);
});

// ─── Celebrate: convierte errores de validación Joi en 400 ──────────────
app.use(celebrateErrors());

// ─── Registrar errores (no responde al cliente, delega con next) ───────
app.use(errorLogger);

// ─── Middleware centralizado de errores (responde al cliente) ──────────
app.use(errorHandler);

// ─── Conexión a MongoDB y arranque ─────────────────────────────────────
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`✅ Conectado a MongoDB en ${MONGO_URL}`);
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });
