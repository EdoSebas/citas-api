const prisma = require('../config/prisma');

const include = { patient: true, doctor: true };

const findAll = ({ date, status, patientId, doctorId } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (patientId) where.patientId = patientId;
  if (doctorId) where.doctorId = doctorId;
  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    where.dateTime = { gte: start, lt: end };
  }
  return prisma.appointment.findMany({ where, include, orderBy: { dateTime: 'asc' } });
};

const findById = (id) => prisma.appointment.findUnique({ where: { id }, include });

// Cita activa (no cancelada) del médico en ese horario
const findActiveByDoctorAndDate = (doctorId, dateTime) =>
  prisma.appointment.findFirst({
    where: { doctorId, dateTime, status: { not: 'CANCELLED' } },
  });

const create = (data) => prisma.appointment.create({ data, include });

const updateStatus = (id, status) =>
  prisma.appointment.update({ where: { id }, data: { status }, include });

module.exports = { findAll, findById, findActiveByDoctorAndDate, create, updateStatus };
