import { useState } from "react";
import TaskService from "../services/api";

function TaskList({ tasks, loading, onTaskUpdated, onTaskDeleted, onError }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editTags, setEditTags] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [editError, setEditError] = useState(null);

  // Start editing a task
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "medium");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditTags(task.tags ? task.tags.join(", ") : "");
    setEditError(null);
    onError?.(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("medium");
    setEditDueDate("");
    setEditTags("");
    setEditError(null);
  };

  // Save task changes
  const saveTask = async (id) => {
    if (!editTitle.trim()) {
      setEditError("Title is required.");
      return;
    }

    if (editTitle.length > 200) {
      setEditError("Title must be less than 200 characters.");
      return;
    }

    if (editDescription.length > 2000) {
      setEditError("Description must be less than 2000 characters.");
      return;
    }

    setSavingId(id);
    setEditError(null);
    onError?.(null);

    try {
      // Parse tags
      const tagArray = editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updateData = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        ...(editDueDate && { dueDate: editDueDate }),
        ...(tagArray.length > 0 && { tags: tagArray }),
      };

      await TaskService.updateTask(id, updateData);
      cancelEditing();
      onTaskUpdated?.();
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Could not update task.";
      setEditError(message);
      onError?.(message);
      console.error("Update task error:", err);
    } finally {
      setSavingId(null);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setDeletingId(id);
    onError?.(null);

    try {
      await TaskService.deleteTask(id);
      onTaskDeleted?.();
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Could not delete task.";
      onError?.(message);
      console.error("Delete task error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Update task status
  const updateStatus = async (id, currentStatus) => {
    // Cycle through statuses
    const statusCycle = {
      pending: "in-progress",
      "in-progress": "completed",
      completed: "pending",
    };
    const newStatus = statusCycle[currentStatus] || "pending";

    setCompletingId(id);
    onError?.(null);

    try {
      await TaskService.updateTaskStatus(id, newStatus);
      onTaskUpdated?.();
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Could not update status.";
      onError?.(message);
      console.error("Update status error:", err);
    } finally {
      setCompletingId(null);
    }
  };

  // Get status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "⚙️";
      default:
        return "⏳";
    }
  };

  // Get priority icon and color
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && tasks.length === 0) {
    return <div className="loading-spinner">⏳ Loading tasks...</div>;
  }

  return (
    <section className="panel task-list-panel">
      <h2>📋 Your Tasks ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>🎉 No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${editingId === task._id ? "editing" : ""} ${
                task.status === "completed" ? "completed" : ""
              }`}
            >
              {editingId === task._id ? (
                // Edit Mode
                <div className="task-edit-form">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title"
                      maxLength="200"
                      className="form-input"
                    />
                    <span className="char-count">{editTitle.length}/200</span>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Task description"
                      maxLength="2000"
                      rows="2"
                      className="form-textarea"
                    />
                    <span className="char-count">{editDescription.length}/2000</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="form-select"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tags</label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="Comma-separated tags"
                      className="form-input"
                    />
                  </div>

                  {editError && <p className="error-message">{editError}</p>}

                  <div className="task-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => saveTask(task._id)}
                      disabled={savingId === task._id}
                    >
                      {savingId === task._id ? "⏳ Saving..." : "💾 Save"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={cancelEditing}
                      disabled={savingId === task._id}
                    >
                      ✖️ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="task-header">
                    <div className="task-title-section">
                      <h3
                        className="task-title"
                        onClick={() => updateStatus(task._id, task.status)}
                        title="Click to change status"
                      >
                        <span className="status-toggle">
                          {getStatusIcon(task.status)}
                        </span>
                        {task.title}
                      </h3>
                      <div className="task-meta">
                        <span className="priority-badge">
                          {getPriorityIcon(task.priority)} {task.priority}
                        </span>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div className="task-tags">
                      {task.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {task.dueDate && (
                    <p className="task-due-date">📅 Due: {formatDate(task.dueDate)}</p>
                  )}

                  <p className="task-created">
                    Created: {formatDate(task.createdAt)}
                  </p>

                  <div className="task-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => startEditing(task)}
                      disabled={editingId !== null || completingId !== null || deletingId !== null}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => updateStatus(task._id, task.status)}
                      disabled={completingId === task._id || editingId !== null || deletingId !== null}
                      title={`Current: ${task.status}`}
                    >
                      {completingId === task._id
                        ? "⏳"
                        : task.status === "completed"
                        ? "↩️ Reopen"
                        : "✅ Complete"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTask(task._id)}
                      disabled={deletingId === task._id || editingId !== null}
                    >
                      {deletingId === task._id ? "⏳" : "🗑️ Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;