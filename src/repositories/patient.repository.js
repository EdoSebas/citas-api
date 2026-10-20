const prisma = require('../config/prisma');

const findAll = () => prisma.patient.findMany({ orderBy: { id: 'asc' } });

const findById = (id) => prisma.patient.findUnique({ where: { id } });

const findByDocumentOrEmail = (documentId, email) =>
  prisma.patient.findFirst({ where: { OR: [{ documentId }, { email }] } });

const create = (data) => prisma.patient.create({ data });

module.exports = { findAll, findById, findByDocumentOrEmail, create };
