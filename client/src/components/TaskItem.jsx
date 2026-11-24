function TaskItem({ task, onEdit, onToggle, onDelete }) {
  const isCompleted = task.status === "completed";
  const formattedDueDate = task.dueDate ? task.dueDate.split("T")[0] : "";

  return (
    <article className={`task-card ${isCompleted ? "is-completed" : ""}`}>
      <div className="task-info">
        <div className="task-title-row">
          <h3 className="task-title">{task.title}</h3>
          <span
            className={`status-badge ${
              isCompleted ? "status-completed" : "status-pending"
            }`}
          >
            {task.status}
          </span>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          {formattedDueDate && (
            <span className="due-date">Due: {formattedDueDate}</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="btn-sm" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button
          type="button"
          className="btn-sm btn-complete"
          onClick={() => onToggle(task)}
        >
          {isCompleted ? "Mark Pending" : "Complete"}
        </button>

        <button
          type="button"
          className="btn-sm btn-delete"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
