const USERS_KEY = "taskmate_users_v1";
const TASKS_KEY = "taskmate_tasks_v1";
const SESSION_KEY = "taskmate_session_v1";

export const DEMO_USER = {
  _id: "user_demo_001",
  name: "Rabin Thapa",
  email: "demo@taskmate.dev",
  role: "MERN Intern",
  createdAt: "2026-11-20T09:00:00.000Z",
};

const INITIAL_SAMPLE_TASKS = [
  {
    _id: "task_101",
    userId: "user_demo_001",
    title: "Design MongoDB + Sky Blue UI System",
    description:
      "Build responsive dashboard cards, priority badges, and clean modal dialogs.",
    status: "completed",
    priority: "high",
    category: "Work",
    dueDate: "2026-11-24T00:00:00.000Z",
    createdAt: "2026-11-21T10:00:00.000Z",
  },
  {
    _id: "task_102",
    userId: "user_demo_001",
    title: "Implement JWT Authentication & Ownership Checks",
    description:
      "Hash passwords with bcryptjs and isolate user task collections on the backend.",
    status: "pending",
    priority: "high",
    category: "Study",
    dueDate: "2026-11-26T00:00:00.000Z",
    createdAt: "2026-11-22T14:30:00.000Z",
  },
  {
    _id: "task_103",
    userId: "user_demo_001",
    title: "Write Automated REST API Integration Tests",
    description:
      "Verify 200, 201, 400, 401, and 404 responses for all task endpoints.",
    status: "pending",
    priority: "medium",
    category: "Work",
    dueDate: "2026-11-28T00:00:00.000Z",
    createdAt: "2026-11-23T08:15:00.000Z",
  },
  {
    _id: "task_104",
    userId: "user_demo_001",
    title: "Prepare Internship Demo & Architecture Notes",
    description:
      "Document request-response lifecycle from React UI through Express to MongoDB.",
    status: "pending",
    priority: "low",
    category: "Personal",
    dueDate: "2026-11-30T00:00:00.000Z",
    createdAt: "2026-11-24T11:45:00.000Z",
  },
];

export function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function readUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const initial = [{ ...DEMO_USER, password: "password123" }];
    localStorage.setItem(USERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw);
}

export function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function writeSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function readAllTasks() {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_SAMPLE_TASKS));
    return INITIAL_SAMPLE_TASKS;
  }
  return JSON.parse(raw);
}

export function writeAllTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function resetUserSampleTasks(userId) {
  const all = readAllTasks().filter((t) => t.userId !== userId);
  const seeded = INITIAL_SAMPLE_TASKS.map((t, idx) => ({
    ...t,
    _id: `task_${Date.now()}_${idx}`,
    userId,
  }));
  const merged = [...seeded, ...all];
  writeAllTasks(merged);
  return seeded;
}
