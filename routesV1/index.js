const express = require('express');
const router = express.Router();

router.use('/plan', require('./plan'));

module.exports = router;
