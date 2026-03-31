import { useCallback, useState } from 'react';
import { BEST_SCORE_KEY, COMBO_WINDOW_MS } from '../utils/constants';
import { useLocalStorage } from './useLocalStorage';

export const useScore = () => {
  const [bestScore, setBestScore] = useLocalStorage<number>(BEST_SCORE_KEY, 0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboTimeLeft, setComboTimeLeft] = useState(0);

  const tickCombo = useCallback((dtMs: number) => {
    setComboTimeLeft((current) => {
      const next = Math.max(0, current - dtMs);
      if (next === 0) {
        setCombo(0);
      }
      return next;
    });
  }, []);

  const registerPipePass = useCallback(() => {
    setCombo((currentCombo) => {
      const nextCombo = currentCombo + 1;
      setScore((currentScore) => {
        const gained = Math.max(1, nextCombo);
        const updated = currentScore + gained;
        if (updated > bestScore) {
          setBestScore(updated);
        }
        return updated;
      });
      return nextCombo;
    });
    setComboTimeLeft(COMBO_WINDOW_MS);
  }, [bestScore, setBestScore]);

  const resetScore = useCallback(() => {
    setScore(0);
    setCombo(0);
    setComboTimeLeft(0);
  }, []);

  return {
    score,
    bestScore,
    combo,
    comboTimeLeft,
    tickCombo,
    registerPipePass,
    resetScore,
  };
};
