const AppError = require('../utils/AppError');

// Valida body, params o query con un esquema de Zod y reemplaza los datos ya limpios.
module.exports = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return next(new AppError('Datos inválidos', 400, details));
  }
  req[source] = result.data;
  next();
};
