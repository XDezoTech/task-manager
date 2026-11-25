import {
  DEMO_USER,
  delay,
  readUsers,
  writeUsers,
  readSession,
  writeSession,
} from "./storageEngine";

export async function loginUser({ email, password }) {
  await delay(250);
  const users = readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!found || found.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const { password: _, ...safeUser } = found;
  const session = {
    token: `jwt_mock_${safeUser._id}_${Date.now()}`,
    user: safeUser,
  };
  writeSession(session);
  return session;
}

export async function registerUser({ name, email, password }) {
  await delay(280);
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    _id: `user_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: "MERN Developer",
    password,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, newUser]);

  const { password: _, ...safeUser } = newUser;
  const session = {
    token: `jwt_mock_${safeUser._id}_${Date.now()}`,
    user: safeUser,
  };
  writeSession(session);
  return session;
}

export async function loginAsDemo() {
  await delay(180);
  readUsers();
  const session = {
    token: `jwt_mock_${DEMO_USER._id}_${Date.now()}`,
    user: DEMO_USER,
  };
  writeSession(session);
  return session;
}

export function getStoredSession() {
  return readSession();
}

export function logoutUser() {
  writeSession(null);
}
