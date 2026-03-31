import type { LeaderboardEntry } from "../../types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard = ({ entries }: LeaderboardProps) => {
  return (
    <section className="w-full max-w-[700px] rounded-xl border border-orange-100/20 bg-black/30 p-4 backdrop-blur-sm">
      <h2 className="mb-3 text-sm uppercase tracking-[0.2em] text-orange-100/90">
        Top Pilots
      </h2>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-orange-50/80">
            No scores yet. Be the first to fly.
          </p>
        ) : null}
        {entries.slice(0, 10).map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-md border border-orange-100/15 bg-slate-950/45 px-3 py-2"
          >
            <span className="text-sm text-orange-50/95">
              #{index + 1} {entry.name}
            </span>
            <span className="text-sm font-semibold text-amber-300">
              {entry.score}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leaderboard;
