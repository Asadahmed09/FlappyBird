import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

type LeaderboardContextValue = ReturnType<typeof useLeaderboard>;

const LeaderboardContext = createContext<LeaderboardContextValue | null>(null);

export const LeaderboardProvider = ({ children }: PropsWithChildren) => {
  const leaderboard = useLeaderboard();
  return <LeaderboardContext.Provider value={leaderboard}>{children}</LeaderboardContext.Provider>;
};

export const useLeaderboardContext = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboardContext must be used inside LeaderboardProvider');
  }
  return context;
};
