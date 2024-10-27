const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use('/', auth);
router.use('/plan', require('./plan'));

module.exports = router;
