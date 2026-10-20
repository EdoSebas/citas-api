const { PrismaClient } = require('@prisma/client');

// Una sola instancia de Prisma Client para toda la aplicación
const prisma = new PrismaClient();

module.exports = prisma;
