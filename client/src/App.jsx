import { useState, useEffect } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButtons";
import TaskList from "./components/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as removeTask,
} from "./services/taskApi";

function App() {
  // Task data from MongoDB
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Edit, filter, and feedback states
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);

  function showFeedback(type, message) {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  }

  // Load tasks from Express API on initial render
  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        showFeedback("error", `Error loading tasks: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingTaskId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      showFeedback("error", "Validation error: Task title is required.");
      return;
    }

    try {
      if (editingTaskId !== null) {
        const updated = await updateTask(editingTaskId, {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
        });

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task._id === editingTaskId ? updated : task,
          ),
        );
        showFeedback("success", "Task updated in MongoDB.");
      } else {
        const created = await createTask({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
        });

        setTasks((previousTasks) => [created, ...previousTasks]);
        showFeedback("success", "New task saved to MongoDB.");
      }

      resetForm();
    } catch (error) {
      showFeedback("error", error.message);
    }
  }

  function editTask(task) {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.split("T") : "");
    setFeedback(null);
  }

  async function toggleTask(task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const updated = await updateTask(task._id, { status: nextStatus });

      setTasks((previousTasks) =>
        previousTasks.map((item) => (item._id === task._id ? updated : item)),
      );
      showFeedback("success", `Marked as ${nextStatus}.`);
    } catch (error) {
      showFeedback("error", error.message);
    }
  }

  async function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmed) return;

    try {
      await removeTask(id);
      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== id),
      );

      if (editingTaskId === id) {
        resetForm();
      }

      showFeedback("success", "Task deleted from database.");
    } catch (error) {
      showFeedback("error", error.message);
    }
  }

  const counts = {
    all: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div>
            <div className="brand">
              <span className="brand-dot" />
              <h1>TaskMate</h1>
            </div>
            <p>Personal Task Manager • MERN Stack</p>
          </div>
          <span className="header-badge">MongoDB Connected</span>
        </div>
      </header>

      <main className="main-content">
        {/* Hero / Welcome Banner */}
        <section className="welcome">
          <span className="welcome-eyebrow">Workspace</span>
          <h2>Organize your tasks. Ship faster.</h2>
          <p>
            Manage daily deliverables, track progress, and persist records in
            MongoDB.
          </p>
        </section>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`feedback-banner ${
              feedback.type === "error" ? "feedback-error" : "feedback-success"
            }`}
            role="alert"
          >
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Modular Task Form */}
        <TaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          editingTaskId={editingTaskId}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {/* Modular Task List & Filters */}
        <section className="task-list-section">
          <div className="section-header">
            <h2>My Tasks ({tasks.length})</h2>
            <FilterButtons
              filter={filter}
              setFilter={setFilter}
              counts={counts}
            />
          </div>

          <TaskList
            tasks={filteredTasks}
            filter={filter}
            isLoading={isLoading}
            onEdit={editTask}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>TaskMate — Built with MongoDB, Express, React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;
