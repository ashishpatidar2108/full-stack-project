const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

TaskSchema.index({ title: 'text', description: 'text', tags: 'text' });
TaskSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);