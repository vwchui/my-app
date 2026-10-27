import * as React from 'react';

export interface Idea {
  id: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = 'my-app:ideas';

function load(): Idea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is Idea =>
        !!i && typeof i.id === 'string' && typeof i.text === 'string' && typeof i.done === 'boolean',
    );
  } catch {
    return [];
  }
}

/**
 * Ideas list. Array order IS the priority (index 0 = highest).
 * Persisted to localStorage.
 */
export function useIdeas() {
  const [ideas, setIdeas] = React.useState<Idea[]>(load);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } catch {
      /* storage unavailable or full — keep working in memory */
    }
  }, []);

  const addIdea = React.useCallback((text: string) => {
    setIdeas((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
  }, []);

  const toggleDone = React.useCallback((id: string) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }, []);

  const removeIdea = React.useCallback((id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /** Swap an open idea with its nearest open neighbour in the given direction. */
  const move = React.useCallback((id: string, direction: -1 | 1) => {
    setIdeas((prev) => {
      const from = prev.findIndex((i) => i.id === id);
      if (from < 0 || prev[from].done) return prev;
      let to = from + direction;
      while (to >= 0 && to < prev.length && prev[to].done) to += direction;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }, []);

  return { ideas, addIdea, toggleDone, removeIdea, move };
}
