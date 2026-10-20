const { z } = require('zod');

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const id = (name) =>
  z
    .number({ required_error: `${name} es obligatorio`, invalid_type_error: `${name} debe ser un número` })
    .int(`${name} debe ser un entero`)
    .positive(`${name} debe ser positivo`);

const createAppointmentSchema = z.object({
  patientId: id('patientId'),
  doctorId: id('doctorId'),
  dateTime: z
    .string({ required_error: 'dateTime es obligatorio' })
    .datetime({ offset: true, message: 'dateTime debe ser fecha ISO, ej: 2026-10-25T09:00:00Z' })
    .transform((value) => new Date(value)),
  reason: z
    .string({ required_error: 'reason es obligatorio' })
    .trim()
    .min(3, 'reason debe tener al menos 3 caracteres')
    .max(255),
});

const updateStatusSchema = z.object({
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: `status debe ser uno de: ${STATUSES.join(', ')}` }),
  }),
});

const idParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: 'id debe ser un número' }).int().positive(),
});

const listQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD')
    .optional(),
  status: z.enum(STATUSES).optional(),
  patientId: z.coerce.number().int().positive().optional(),
  doctorId: z.coerce.number().int().positive().optional(),
});

module.exports = { createAppointmentSchema, updateStatusSchema, idParamSchema, listQuerySchema };
