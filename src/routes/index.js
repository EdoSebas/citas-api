const { Router } = require('express');

const router = Router();

router.use('/patients', require('./patients.routes'));
router.use('/doctors', require('./doctors.routes'));
router.use('/appointments', require('./appointments.routes'));

module.exports = router;
