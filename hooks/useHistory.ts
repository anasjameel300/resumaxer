import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [state, setInternalState] = useState<{
    history: T[];
    index: number;
  }>({
    history: [initialState],
    index: 0,
  });

  const current = state.history[state.index] ?? initialState;

  const setState = useCallback((action: T | ((prev: T) => T)) => {
    setInternalState((prev) => {
      const currentHistory = prev.history.slice(0, prev.index + 1);
      const currentState = currentHistory[currentHistory.length - 1];

      const nextState = typeof action === 'function'
        ? (action as (prev: T) => T)(currentState)
        : action;

      if (currentState === nextState) return prev;

      const newHistory = [...currentHistory, nextState];
      return {
        history: newHistory,
        index: newHistory.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setInternalState((prev) => ({
      ...prev,
      index: Math.max(0, prev.index - 1),
    }));
  }, []);

  const redo = useCallback(() => {
    setInternalState((prev) => ({
      ...prev,
      index: Math.min(prev.history.length - 1, prev.index + 1),
    }));
  }, []);

  const canUndo = state.index > 0;
  const canRedo = state.index < state.history.length - 1;

  return [current, setState, undo, redo, canUndo, canRedo] as const;
}
