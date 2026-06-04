const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/task.service');

async function list(req, res, next) {
  try {
    const { q, status, priority, page, limit, sortBy, order, tags } = req.query;
    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined;
    const data = await service.listTasks({ q, status, priority, page, limit, sortBy, order, tags: parsedTags });
    return ApiResponse.ok(res, data, 'Tasks fetched');
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const data = await service.getTask(req.params.id);
    return ApiResponse.ok(res, data, 'Task fetched');
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const data = await service.createTask(req.body);
    return ApiResponse.created(res, data, 'Task created');
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const data = await service.updateTask(req.params.id, req.body);
    return ApiResponse.ok(res, data, 'Task updated');
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    await service.deleteTask(req.params.id);
    return ApiResponse.noContent(res);
  } catch (e) { next(e); }
}

async function setStatus(req, res, next) {
  try {
    const { status } = req.body;
    const data = await service.updateStatus(req.params.id, status);
    return ApiResponse.ok(res, data, 'Status updated');
  } catch (e) { next(e); }
}

module.exports = { list, getById, create, update, remove, setStatus };
