const { body, param, query } = require('express-validator');

const createTaskValidator = [
  body('title').isString().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('dueDate').optional().isISO8601(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString().trim()
];

const updateTaskValidator = [
  param('id').isMongoId(),
  body('title').optional().isString().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('dueDate').optional().isISO8601(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString().trim()
];

const idParamValidator = [param('id').isMongoId()];

const listQueryValidator = [
  query('q').optional().isString(),
  query('status').optional().isIn(['pending', 'in-progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['createdAt','updatedAt','dueDate','priority','title','status']),
  query('order').optional().isIn(['asc','desc'])
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  idParamValidator,
  listQueryValidator
};
