// Error controlado de la aplicación: lleva un código HTTP y, opcionalmente, detalles.
class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = AppError;
