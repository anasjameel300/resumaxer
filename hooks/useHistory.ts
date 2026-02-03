import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];

  const setState = useCallback((action: T | ((prev: T) => T)) => {
    setHistory((prevHistory) => {
      // If we are not at the end of history, we discard the future
      const currentHistory = prevHistory.slice(0, index + 1);
      const currentState = currentHistory[currentHistory.length - 1];
      
      const nextState = typeof action === 'function' 
        ? (action as (prev: T) => T)(currentState) 
        : action;

      // Optional: Prevent adding to history if state hasn't changed (shallow check)
      if (currentState === nextState) return prevHistory;

      // Optional: Prevent duplicate history entries for simple object updates if expensive
      // For this app, strict equality check above handles reference changes
      
      return [...currentHistory, nextState];
    });
    
    // We update index based on the new length. 
    // Since we are inside a callback, we can't rely on the 'history' variable from closure easily
    // We update index in a separate setter, but we need to ensure it syncs.
    // simpler approach:
    setIndex((prevIndex) => prevIndex + 1);
  }, [index]);

  const undo = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex((prev) => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return [state, setState, undo, redo, canUndo, canRedo] as const;
}