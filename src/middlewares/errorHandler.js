const AppError = require('../utils/AppError');

// Manejo centralizado de errores: siempre responde con { error, details? }
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Prisma: valor único repetido (red de seguridad por si falla la validación del servicio)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con un valor único repetido' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
};
