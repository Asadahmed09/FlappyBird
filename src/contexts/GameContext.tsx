import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';

type GameContextValue = ReturnType<typeof useGameEngine>;

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: PropsWithChildren) => {
  const engine = useGameEngine();
  return <GameContext.Provider value={engine}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};
