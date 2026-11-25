import TaskItem from "./TaskItem";

function TaskList({ tasks, filter, isLoading, onEdit, onToggle, onDelete }) {
  if (isLoading) {
    return (
      <div className="empty-state">
        <p>Loading tasks from MongoDB...</p>
        <span>Fetching your latest workspace records.</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No {filter !== "all" ? filter : ""} tasks found.</p>
        <span>Add a new task above or switch your filter view.</span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
