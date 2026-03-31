import { useMemo } from 'react';
import type { GameMode, LeaderboardEntry } from '../types';
import { LEADERBOARD_KEY } from '../utils/constants';
import { useLocalStorage } from './useLocalStorage';

const MAX_ENTRIES = 20;

export const useLeaderboard = () => {
  const [entries, setEntries] = useLocalStorage<LeaderboardEntry[]>(LEADERBOARD_KEY, []);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [entries]);

  const addEntry = (name: string, score: number, mode: GameMode) => {
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: name.trim() || 'Player',
      score,
      mode,
      createdAt: new Date().toISOString(),
    };

    setEntries((current) => {
      const next = [...current, entry].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return next.slice(0, MAX_ENTRIES);
    });
  };

  return {
    entries: sortedEntries,
    topTen: sortedEntries.slice(0, 10),
    addEntry,
  };
};
