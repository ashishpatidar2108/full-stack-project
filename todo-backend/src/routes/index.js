const router = require('express').Router();
router.use('/tasks', require('./task.routes'));
module.exports = router;
