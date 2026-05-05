// services/auth.service.js
// All authentication API calls go through this service layer.
// To switch to a real backend, replace the mock implementations below
// with real httpClient calls — component code stays unchanged.

import { MOCK_USERS } from "@/lib/mockData";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const authService = {
  /**
   * Login user with email + password.
   * Returns { token, user } on success.
   */
  login: async ({ email, password }) => {
    await delay(800); // simulate network
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Invalid email or password.");
    const { password: _p, ...safeUser } = user;
    const token = btoa(`${user.id}:${user.role}:${Date.now()}`);
    return { token, user: safeUser };
  },

  /**
   * Logout – clears local storage.
   */
  logout: async () => {
    await delay(200);
    return { success: true };
  },

  /**
   * Validate existing token (called on app load).
   */
  validateToken: async (token) => {
    await delay(300);
    if (!token) throw new Error("No token provided.");
    const [userId] = atob(token).split(":");
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error("Invalid token.");
    const { password: _p, ...safeUser } = user;
    return { user: safeUser };
  },
};

export default authService;
