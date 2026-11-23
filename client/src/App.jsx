import { useState } from "react";
import "./App.css";

function App() {
  // Task data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Learn React fundamentals",
      description: "Understand components, props and state.",
      status: "pending",
      dueDate: "",
    },
    {
      id: 2,
      title: "Create TaskMate frontend",
      description: "Build the initial user interface.",
      status: "completed",
      dueDate: "",
    },
  ]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Edit and filter states
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Reset form
  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingTaskId(null);
  }

  // Create or update task
  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    if (editingTaskId !== null) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: title.trim(),
                description: description.trim(),
                dueDate,
              }
            : task,
        ),
      );
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        status: "pending",
        dueDate,
      };

      setTasks((previousTasks) => [...previousTasks, newTask]);
    }

    resetForm();
  }

  // Edit task
  function editTask(task) {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
  }

  // Complete or mark pending
  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task,
      ),
    );
  }

  // Delete task
  function deleteTask(id) {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));

    if (editingTaskId === id) {
      resetForm();
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") {
      return task.status === "pending";
    }

    if (filter === "completed") {
      return task.status === "completed";
    }

    return true;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>TaskMate</h1>
        <p>Your personal task manager</p>
      </header>

      <main className="main-content">
        {/* Welcome */}
        <section className="welcome">
          <h2>Manage your tasks</h2>
          <p>Organize your work and stay productive.</p>
        </section>

        {/* Task Form */}
        <section className="task-form-section">
          <h2>{editingTaskId !== null ? "Edit Task" : "Add a new task"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <textarea
              placeholder="Task description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />

            <button type="submit">
              {editingTaskId !== null ? "Update Task" : "Add Task"}
            </button>

            {editingTaskId !== null && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* Task List */}
        <section className="task-list-section">
          <h2>My Tasks ({tasks.length})</h2>

          {/* Filter Buttons */}
          <div className="filter-controls">
            <button
              type="button"
              className={filter === "all" ? "active-filter" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              className={filter === "pending" ? "active-filter" : ""}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>

            <button
              type="button"
              className={filter === "completed" ? "active-filter" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          {/* Display Filtered Tasks */}
          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <span>{task.status}</span>

                    {task.dueDate && <p>Due: {task.dueDate}</p>}
                  </div>

                  {/* Task Actions */}
                  <div className="task-actions">
                    <button type="button" onClick={() => editTask(task)}>
                      Edit
                    </button>

                    <button type="button" onClick={() => toggleTask(task.id)}>
                      {task.status === "completed"
                        ? "Mark Pending"
                        : "Complete"}
                    </button>

                    <button type="button" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>TaskMate - Personal Task Manager</p>
      </footer>
    </div>
  );
}

export default App;
