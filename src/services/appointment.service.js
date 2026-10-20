const AppError = require('../utils/AppError');
const appointmentRepository = require('../repositories/appointment.repository');
const patientRepository = require('../repositories/patient.repository');
const doctorRepository = require('../repositories/doctor.repository');

// Cambios de estado permitidos
const TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const list = (filters) => appointmentRepository.findAll(filters);

const getById = async (id) => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) throw new AppError('Cita no encontrada', 404);
  return appointment;
};

const schedule = async ({ patientId, doctorId, dateTime, reason }) => {
  if (dateTime <= new Date()) {
    throw new AppError('No se puede programar una cita en una fecha pasada', 400);
  }

  const patient = await patientRepository.findById(patientId);
  if (!patient) throw new AppError('El paciente no existe', 404);

  const doctor = await doctorRepository.findById(doctorId);
  if (!doctor) throw new AppError('El médico no existe', 404);

  // Regla de negocio: un médico no puede tener dos citas activas a la misma hora
  const conflict = await appointmentRepository.findActiveByDoctorAndDate(doctorId, dateTime);
  if (conflict) {
    throw new AppError('El médico ya tiene una cita en ese horario', 409);
  }

  return appointmentRepository.create({ patientId, doctorId, dateTime, reason });
};

const changeStatus = async (id, newStatus) => {
  const appointment = await getById(id);
  if (!TRANSITIONS[appointment.status].includes(newStatus)) {
    throw new AppError(`No se puede cambiar una cita de ${appointment.status} a ${newStatus}`, 409);
  }
  return appointmentRepository.updateStatus(id, newStatus);
};

// Cancelación lógica: se conserva el historial cambiando el estado
const cancel = (id) => changeStatus(id, 'CANCELLED');

module.exports = { list, getById, schedule, changeStatus, cancel };
