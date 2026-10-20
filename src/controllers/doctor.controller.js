const asyncHandler = require('../utils/asyncHandler');
const doctorService = require('../services/doctor.service');

const list = asyncHandler(async (req, res) => {
  res.json(await doctorService.list());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await doctorService.register(req.body));
});

module.exports = { list, create };
