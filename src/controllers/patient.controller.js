const asyncHandler = require('../utils/asyncHandler');
const patientService = require('../services/patient.service');

const list = asyncHandler(async (req, res) => {
  res.json(await patientService.list());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await patientService.register(req.body));
});

module.exports = { list, create };
