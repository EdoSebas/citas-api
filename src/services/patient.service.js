const AppError = require('../utils/AppError');
const patientRepository = require('../repositories/patient.repository');

const list = () => patientRepository.findAll();

const register = async (data) => {
  const existing = await patientRepository.findByDocumentOrEmail(data.documentId, data.email);
  if (existing) {
    throw new AppError('Ya existe un paciente con ese documento o correo', 409);
  }
  return patientRepository.create(data);
};

module.exports = { list, register };
