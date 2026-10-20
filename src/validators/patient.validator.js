const { z } = require('zod');

const createPatientSchema = z.object({
  fullName: z
    .string({ required_error: 'fullName es obligatorio' })
    .trim()
    .min(3, 'fullName debe tener al menos 3 caracteres')
    .max(150),
  documentId: z
    .string({ required_error: 'documentId es obligatorio' })
    .trim()
    .min(5, 'documentId debe tener al menos 5 caracteres')
    .max(30),
  email: z
    .string({ required_error: 'email es obligatorio' })
    .trim()
    .email('email no es válido')
    .max(120),
  phone: z
    .string({ required_error: 'phone es obligatorio' })
    .trim()
    .regex(/^[0-9+\s-]{7,20}$/, 'phone no es válido'),
});

module.exports = { createPatientSchema };
