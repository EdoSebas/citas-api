const { Router } = require('express');
const controller = require('../controllers/patient.controller');
const validate = require('../middlewares/validate');
const { createPatientSchema } = require('../validators/patient.validator');

const router = Router();

router.get('/', controller.list);
router.post('/', validate(createPatientSchema), controller.create);

module.exports = router;
