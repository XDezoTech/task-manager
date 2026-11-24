function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  editingTaskId,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="task-form-section">
      <h2>{editingTaskId !== null ? "Edit Task" : "Create a New Task"}</h2>

      <form className="task-form" onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g., Build Express REST routes"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description (optional)</label>
          <textarea
            id="task-description"
            placeholder="Add context, acceptance criteria, or notes..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date">Due Date (optional)</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingTaskId !== null ? "Update Task" : "Add Task"}
          </button>

          {editingTaskId !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
