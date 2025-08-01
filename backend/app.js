// app.js
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://localhost:27017/aroundb";

// Middleware para parsear JSON
app.use(express.json());

// 🔒 Middleware de autorización temporal
// Inyecta un usuario de prueba en cada petición (hard-coded)
app.use((req, res, next) => {
  req.user = { _id: "684bad1806e99a243068d47a" }; // ID de usuario de prueba
  next();
});

// Rutas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  const err = new Error("Recurso solicitado no encontrado");
  err.statusCode = 404;
  next(err);
});

// Middleware central de manejo de errores
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // Manejo de errores de Mongoose
  if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
  } else if (err.name === "CastError") {
    res.status(400).json({ message: "ID inválido" });
  } else if (err.name === "DocumentNotFoundError") {
    res.status(404).json({ message: message || "Recurso no encontrado" });
  } else {
    res.status(statusCode).json({
      message: statusCode === 500 ? "Error interno del servidor" : message,
    });
  }
});

// Conexión a MongoDB y arranque del servidor
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`✅ Conectado a MongoDB en ${MONGO_URL}`);
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1); // Salir del proceso con error
  });
