const { z } = require('zod');

const createDoctorSchema = z.object({
  fullName: z
    .string({ required_error: 'fullName es obligatorio' })
    .trim()
    .min(3, 'fullName debe tener al menos 3 caracteres')
    .max(150),
  specialty: z
    .string({ required_error: 'specialty es obligatorio' })
    .trim()
    .min(3, 'specialty debe tener al menos 3 caracteres')
    .max(100),
  email: z
    .string({ required_error: 'email es obligatorio' })
    .trim()
    .email('email no es válido')
    .max(120),
});

module.exports = { createDoctorSchema };
