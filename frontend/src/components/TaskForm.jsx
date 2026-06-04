import { useState } from "react";
import TaskService from "../services/api";

function TaskForm({ onTaskAdded, onError }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setTags("");
    setFormError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    onError?.(null);

    // Validation
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (title.length > 200) {
      setFormError("Title must be less than 200 characters.");
      return;
    }

    if (description.length > 2000) {
      setFormError("Description must be less than 2000 characters.");
      return;
    }

    try {
      setSubmitting(true);

      // Parse tags if provided
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        ...(dueDate && { dueDate }),
        ...(tagArray.length > 0 && { tags: tagArray }),
      };

      await TaskService.createTask(taskData);

      // Success - reset form and notify parent
      resetForm();
      onTaskAdded?.();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Could not create task. Please check your input.";
      setFormError(message);
      onError?.(message);
      console.error("Create task error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel task-form-panel">
      <h2>✨ Add a New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="200"
            className="form-input"
            disabled={submitting}
          />
          <span className="char-count">{title.length}/200</span>
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="2000"
            rows="3"
            className="form-textarea"
            disabled={submitting}
          />
          <span className="char-count">{description.length}/2000</span>
        </div>

        {/* Priority Select */}
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
            disabled={submitting}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
            disabled={submitting}
          />
        </div>

        {/* Tags Input */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="Comma-separated tags (e.g., work, urgent, home)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-input"
            disabled={submitting}
          />
          <small className="help-text">Separate multiple tags with commas</small>
        </div>

        {/* Error Message */}
        {formError && <p className="error-message">{formError}</p>}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "⏳ Creating..." : "➕ Create Task"}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;