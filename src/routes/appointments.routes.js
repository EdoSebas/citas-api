const { Router } = require('express');
const controller = require('../controllers/appointment.controller');
const validate = require('../middlewares/validate');
const {
  createAppointmentSchema,
  updateStatusSchema,
  idParamSchema,
  listQuerySchema,
} = require('../validators/appointment.validator');

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), controller.list);
router.get('/:id', validate(idParamSchema, 'params'), controller.getById);
router.post('/', validate(createAppointmentSchema), controller.create);
router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateStatusSchema),
  controller.updateStatus
);
router.delete('/:id', validate(idParamSchema, 'params'), controller.cancel);

module.exports = router;
