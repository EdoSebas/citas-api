const prisma = require('../config/prisma');

const findAll = () => prisma.doctor.findMany({ orderBy: { id: 'asc' } });

const findById = (id) => prisma.doctor.findUnique({ where: { id } });

const findByEmail = (email) => prisma.doctor.findUnique({ where: { email } });

const create = (data) => prisma.doctor.create({ data });

module.exports = { findAll, findById, findByEmail, create };
