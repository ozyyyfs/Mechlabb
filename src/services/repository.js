// Replace this adapter with HTTP/database-backed repositories when adding accounts.
// Reading and writing stays outside view components; local preferences are device-specific.
export const repository = {
  read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(`mechlab:${key}`));
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(`mechlab:${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
