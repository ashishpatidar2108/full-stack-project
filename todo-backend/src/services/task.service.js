const Task = require('../models/task');
const ApiError = require('../utils/ApiError');

function buildFilter({ q, status, priority, tags }) {
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (tags && Array.isArray(tags) && tags.length) filter.tags = { $all: tags };
  if (q) {
    filter.$text = { $search: q };
  }
  return filter;
}

async function listTasks(opts) {
  const {
    q, status, priority, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', tags
  } = opts;

  const filter = buildFilter({ q, status, priority, tags });
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

  const [items, total] = await Promise.all([
    Task.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Task.countDocuments(filter)
  ]);

  return { items, total, page: Number(page), pages: Math.ceil(total / limit) || 1 };
}

async function getTask(id) {
  const task = await Task.findById(id);
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
}

async function createTask(payload) {
  const task = await Task.create(payload);
  return task;
}

async function updateTask(id, payload) {
  const task = await Task.findByIdAndUpdate(id, payload, { new: true });
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
}

async function deleteTask(id) {
  const res = await Task.findByIdAndDelete(id);
  if (!res) throw new ApiError(404, 'Task not found');
  return true;
}

async function updateStatus(id, status) {
  return updateTask(id, { status });
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateStatus
};
