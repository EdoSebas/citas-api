const AppError = require('../utils/AppError');
const doctorRepository = require('../repositories/doctor.repository');

const list = () => doctorRepository.findAll();

const register = async (data) => {
  const existing = await doctorRepository.findByEmail(data.email);
  if (existing) {
    throw new AppError('Ya existe un médico con ese correo', 409);
  }
  return doctorRepository.create(data);
};

module.exports = { list, register };
