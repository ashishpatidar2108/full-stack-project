const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const validate = require('../middlewares/validate');
const { createTaskValidator, updateTaskValidator, idParamValidator, listQueryValidator } = require('../validators/task.validators');

router.get('/', listQueryValidator, validate, ctrl.list);
router.get('/:id', idParamValidator, validate, ctrl.getById);
router.post('/', createTaskValidator, validate, ctrl.create);
router.patch('/:id', updateTaskValidator, validate, ctrl.update);
router.delete('/:id', idParamValidator, validate, ctrl.remove);
router.patch('/:id/status', [
  ...idParamValidator,
  require('express-validator').body('status').isIn(['pending','in-progress','completed'])
], validate, ctrl.setStatus);

module.exports = router;
