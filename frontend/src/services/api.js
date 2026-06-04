import axios from "axios";

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with base configuration
const API = axios.create({
  baseURL: `${API_BASE_URL}/api/tasks`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and error handling
API.interceptors.request.use(
  (config) => {
    console.log(`📤 Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
API.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Error in request setup
      console.error("Error message:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Service with all endpoints
const TaskService = {
  // Get all tasks with filters, sorting, and pagination
  getTasks: async (options = {}) => {
    const params = new URLSearchParams();
    
    if (options.search) params.append("q", options.search);
    if (options.status) params.append("status", options.status);
    if (options.priority) params.append("priority", options.priority);
    if (options.tags) params.append("tags", Array.isArray(options.tags) ? options.tags.join(",") : options.tags);
    if (options.page) params.append("page", options.page);
    if (options.limit) params.append("limit", options.limit || 10);
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.order) params.append("order", options.order);
    
    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : "/";
    
    return API.get(url);
  },

  // Get a single task by ID
  getTask: async (id) => {
    return API.get(`/${id}`);
  },

  // Create a new task
  createTask: async (taskData) => {
    return API.post("/", taskData);
  },

  // Update a task (full or partial update)
  updateTask: async (id, taskData) => {
    return API.patch(`/${id}`, taskData);
  },

  // Update only the status of a task
  updateTaskStatus: async (id, status) => {
    return API.patch(`/${id}/status`, { status });
  },

  // Delete a task
  deleteTask: async (id) => {
    return API.delete(`/${id}`);
  },

  // Search tasks
  searchTasks: async (query, options = {}) => {
    return TaskService.getTasks({
      ...options,
      search: query,
    });
  },

  // Filter tasks by status
  filterByStatus: async (status, options = {}) => {
    return TaskService.getTasks({
      ...options,
      status,
    });
  },

  // Filter tasks by priority
  filterByPriority: async (priority, options = {}) => {
    return TaskService.getTasks({
      ...options,
      priority,
    });
  },

  // Get tasks with pagination
  getPaginatedTasks: async (page, limit, options = {}) => {
    return TaskService.getTasks({
      ...options,
      page,
      limit,
    });
  },
};

export default TaskService;
export { API };