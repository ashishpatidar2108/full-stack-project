import { useEffect, useState } from "react";
import TaskService from "./services/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./index.css";
import axios from "axios";

function App() {
  useEffect(() => {
    axios.get("http://full-stack-project8.onrender.com/api/tasks")
      .then((res) => console.log(res.data))
      .catch((err) => console.error( err));
  }, []);

  return (
    <div>hello, world!</div>
  );
  export default App;
  // Rest of the App component code...
}
function App() {
  // Main state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filter & Search state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Fetch tasks with current filters and pagination
  const fetchTasks = async (page = 1, clearSearch = false) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await TaskService.getTasks({
        search: clearSearch ? "" : search,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        page,
        limit,
        sortBy,
        order,
      });

      const { items = [], total = 0, pages = 1 } = response.data.data;
      setTasks(items);
      setTotalTasks(total);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load tasks.";
      setError(errorMsg);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchTasks(1);
  };

  // Clear filters handler
  const handleClearFilters = async () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortBy("createdAt");
    setOrder("desc");
    setCurrentPage(1);
    await fetchTasks(1, true);
  };

  // Change sort handler
  const handleSortChange = async (newSortBy) => {
    const newOrder = newSortBy === sortBy && order === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1);
    // Will be called via useEffect
  };

  // Handle page change
  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      await fetchTasks(newPage);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = async (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    // Will be called via useEffect
  };

  // Handle priority filter change
  const handlePriorityFilterChange = async (priority) => {
    setPriorityFilter(priority);
    setCurrentPage(1);
    // Will be called via useEffect
  };

  // Show success message temporarily
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchTasks(1);
  }, [statusFilter, priorityFilter, sortBy, order, limit]);

  // Refresh tasks
  const handleRefresh = () => {
    fetchTasks(currentPage);
  };

  // Format pagination info
  const paginationInfo = `Page ${currentPage} of ${totalPages} (${totalTasks} total tasks)`;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>📝 To-Do List</h1>
          <p className="subheading">A fully integrated To-Do app with live backend sync</p>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="message error-message">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}
      {success && (
        <div className="message success-message">
          <span>✅ {success}</span>
        </div>
      )}

      {/* Search & Filters Panel */}
      <section className="panel filters-panel">
        <div className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Searching..." : " Search"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">⚙️ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => handlePriorityFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium"> Medium</option>
              <option value="high"> High</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
            <span className="sort-order">{order === "asc" ? "↑" : "↓"}</span>
          </div>

          <div className="filter-group">
            <label>Items per page:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="filter-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear Filters
          </button>
        </div>

        {/* Info & Status */}
        <div className="filter-info">
          {loading && <span className="loading-text">⏳ Loading tasks...</span>}
          <span className="pagination-info">{paginationInfo}</span>
        </div>
      </section>

      {/* Add Task Form */}
      <TaskForm
        onTaskAdded={() => {
          showSuccess("✅ Task created successfully!");
          fetchTasks(1);
        }}
        onError={(err) => setError(err)}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onTaskUpdated={() => {
          showSuccess("✅ Task updated successfully!");
          fetchTasks(currentPage);
        }}
        onTaskDeleted={() => {
          showSuccess("✅ Task deleted successfully!");
          fetchTasks(currentPage);
        }}
        onError={(err) => setError(err)}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <section className="panel pagination-controls">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
                disabled={loading}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next →
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built with React + Express.js + MongoDB | Backend: {" "}
          <code>{process.env.REACT_APP_API_URL || "http://localhost:5000"}</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
