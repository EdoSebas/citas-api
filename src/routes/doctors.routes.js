const { Router } = require('express');
const controller = require('../controllers/doctor.controller');
const validate = require('../middlewares/validate');
const { createDoctorSchema } = require('../validators/doctor.validator');

const router = Router();

router.get('/', controller.list);
router.post('/', validate(createDoctorSchema), controller.create);

module.exports = router;
