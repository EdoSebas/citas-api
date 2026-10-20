const asyncHandler = require('../utils/asyncHandler');
const appointmentService = require('../services/appointment.service');

const list = asyncHandler(async (req, res) => {
  res.json(await appointmentService.list(req.query));
});

const getById = asyncHandler(async (req, res) => {
  res.json(await appointmentService.getById(req.params.id));
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await appointmentService.schedule(req.body));
});

const updateStatus = asyncHandler(async (req, res) => {
  res.json(await appointmentService.changeStatus(req.params.id, req.body.status));
});

const cancel = asyncHandler(async (req, res) => {
  res.json(await appointmentService.cancel(req.params.id));
});

module.exports = { list, getById, create, updateStatus, cancel };
