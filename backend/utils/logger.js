// utils/logger.js
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const reqLogPath = path.join(logDir, "request.log");
const errLogPath = path.join(logDir, "error.log");

const appendJsonLine = async (filePath, obj) => {
  const line = `${JSON.stringify(obj)}\n`;
  try {
    await fs.promises.appendFile(filePath, line, "utf8");
  } catch (e) {
    // Si el logging falla, no queremos romper la app; lo imprimimos por consola
    // pero NO lanzamos error.
    /* eslint-disable no-console */
    console.error("Logger append error:", e);
    /* eslint-enable no-console */
  }
};

const logRequest = async (entry) => {
  await appendJsonLine(reqLogPath, entry);
};

const logError = async (entry) => {
  await appendJsonLine(errLogPath, entry);
};

module.exports = { logRequest, logError };
