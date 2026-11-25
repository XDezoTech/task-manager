import {
  delay,
  readAllTasks,
  writeAllTasks,
  resetUserSampleTasks,
} from "./storageEngine";

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

export async function fetchTasksForUser(
  userId,
  {
    status = "all",
    priority = "all",
    category = "all",
    search = "",
    sortBy = "newest",
    page = 1,
    limit = 5,
  } = {},
) {
  await delay(180);
  const allTasks = readAllTasks().filter((task) => task.userId === userId);

  // Compute live stats across all tasks belonging to this user
  const todayStr = new Date().toISOString().split("T")[0];
  const stats = {
    total: allTasks.length,
    pending: allTasks.filter((t) => t.status === "pending").length,
    completed: allTasks.filter((t) => t.status === "completed").length,
    highPriority: allTasks.filter(
      (t) => t.priority === "high" && t.status === "pending",
    ).length,
    overdue: allTasks.filter(
      (t) =>
        t.status === "pending" &&
        t.dueDate &&
        t.dueDate.split("T")[0] < todayStr,
    ).length,
  };

  // Filter pipeline
  let filtered = [...allTasks];

  if (status !== "all") {
    filtered = filtered.filter((t) => t.status === status);
  }

  if (priority !== "all") {
    filtered = filtered.filter((t) => t.priority === priority);
  }

  if (category !== "all") {
    filtered = filtered.filter((t) => t.category === category);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)),
    );
  }

  // Sort pipeline
  filtered.sort((a, b) => {
    if (sortBy === "priority") {
      return (
        (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0)
      );
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Pagination slice
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * limit;
  const paginatedTasks = filtered.slice(startIndex, startIndex + limit);

  return {
    tasks: paginatedTasks,
    stats,
    pagination: {
      page: safePage,
      limit,
      totalFiltered,
      totalPages,
    },
  };
}

export async function createNewTask(userId, payload) {
  await delay(160);
  if (!payload.title || !payload.title.trim()) {
    throw new Error("Task title is required.");
  }

  const now = new Date().toISOString();
  const newTask = {
    _id: `task_${Date.now()}`,
    userId,
    title: payload.title.trim(),
    description: payload.description ? payload.description.trim() : "",
    status: "pending",
    priority: payload.priority || "medium",
    category: payload.category || "Personal",
    dueDate: payload.dueDate ? `${payload.dueDate}T00:00:00.000Z` : null,
    createdAt: now,
    updatedAt: now,
  };

  const all = readAllTasks();
  writeAllTasks([newTask, ...all]);
  return newTask;
}

export async function updateExistingTask(userId, taskId, updates) {
  await delay(150);
  const all = readAllTasks();
  const index = all.findIndex((t) => t._id === taskId && t.userId === userId);

  if (index === -1) {
    throw new Error("Task not found or access denied.");
  }

  const current = all[index];
  const updated = {
    ...current,
    ...updates,
    title: updates.title !== undefined ? updates.title.trim() : current.title,
    description:
      updates.description !== undefined
        ? updates.description.trim()
        : current.description,
    dueDate:
      updates.dueDate !== undefined
        ? updates.dueDate
          ? `${updates.dueDate}T00:00:00.000Z`
          : null
        : current.dueDate,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  writeAllTasks(all);
  return updated;
}

export async function deleteExistingTask(userId, taskId) {
  await delay(150);
  const all = readAllTasks();
  const next = all.filter((t) => !(t._id === taskId && t.userId === userId));
  writeAllTasks(next);
  return { deletedId: taskId };
}

export async function restoreSampleTasks(userId) {
  await delay(200);
  return resetUserSampleTasks(userId);
}
