import { useState, useCallback } from 'react';
import { repository } from '../services/repository.js';
export function useLab() {
  const [theme, setTheme] = useState(() =>
    repository.read('theme', 'light') === 'dark' ? 'dark' : 'light',
  );
  const [favorites, setFavorites] = useState(() => {
    const v = repository.read('favorites', []);
    return Array.isArray(v) ? v : [];
  });
  const [activity, setActivity] = useState(() => {
    const v = repository.read('activity', []);
    return Array.isArray(v) ? v : [];
  });
  const [toast, setToast] = useState(null);
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);
  const persist = useCallback(
    (key, value) => {
      if (!repository.write(key, value))
        notify('Browser storage is unavailable. Changes will last for this session.');
    },
    [notify],
  );
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    persist('theme', next);
  };
  const toggleFavorite = useCallback(
    (item) => {
      setFavorites((previous) => {
        const exists = previous.some((f) => f.key === item.key);
        const next = exists ? previous.filter((f) => f.key !== item.key) : [item, ...previous];
        persist('favorites', next);
        notify(exists ? 'Bookmark removed' : 'Saved to My Favorites');
        return next;
      });
    },
    [persist, notify],
  );
  const record = useCallback(
    (item) => {
      setActivity((previous) => {
        const next = [
          {
            ...previous.find((entry) => entry.key === item.key),
            ...item,
            time: new Date().toISOString(),
          },
          ...previous.filter((f) => f.key !== item.key),
        ].slice(0, 20);
        persist('activity', next);
        return next;
      });
    },
    [persist],
  );
  const clearActivity = () => {
    setActivity([]);
    persist('activity', []);
    notify('Recent activity cleared');
  };
  return {
    theme,
    toggleTheme,
    favorites,
    toggleFavorite,
    activity,
    record,
    clearActivity,
    toast,
    setToast,
    notify,
  };
}
