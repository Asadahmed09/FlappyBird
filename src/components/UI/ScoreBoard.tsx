import type { GameMode, GameState } from "../../types";

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  combo: number;
  comboTimeLeft: number;
  spiceLevel: number;
  mode: GameMode;
  gameState: GameState;
  timeLeftMs: number;
}

const ScoreBoard = ({
  score,
  bestScore,
  combo,
  comboTimeLeft,
  spiceLevel,
  mode,
  gameState,
  timeLeftMs,
}: ScoreBoardProps) => {
  const seconds = Math.ceil(timeLeftMs / 1000);

  return (
    <section className="grid w-full max-w-[700px] grid-cols-2 gap-3 sm:grid-cols-5">
      <div className="rounded-lg border border-amber-200/40 bg-amber-500/15 p-3 text-center backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wide text-slate-300">Score</p>
        <p className="text-xl font-bold text-amber-300">{score}</p>
      </div>
      <div className="rounded-lg border border-lime-200/40 bg-lime-500/15 p-3 text-center backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wide text-slate-300">Best</p>
        <p className="text-xl font-bold text-lime-300">{bestScore}</p>
      </div>
      <div className="rounded-lg border border-sky-200/40 bg-sky-500/15 p-3 text-center backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wide text-slate-300">Combo</p>
        <p className="text-xl font-bold text-sky-300">x{Math.max(1, combo)}</p>
        {combo > 0 && comboTimeLeft > 0 ? (
          <p className="text-[10px] text-slate-300">
            {(comboTimeLeft / 1000).toFixed(1)}s
          </p>
        ) : null}
      </div>
      <div className="rounded-lg border border-fuchsia-200/40 bg-fuchsia-500/15 p-3 text-center backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wide text-slate-300">Mode</p>
        <p className="text-base font-semibold text-fuchsia-200">{mode}</p>
        {mode === "timeAttack" ? (
          <p className="text-[10px] text-slate-300">{seconds}s left</p>
        ) : null}
      </div>
      <div className="rounded-lg border border-orange-300/45 bg-black/35 p-3 text-center backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wide text-orange-200">Spice</p>
        <p className="text-base font-bold text-orange-300">
          {Math.round(spiceLevel)}%
        </p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-slate-800">
          <div
            className="h-full rounded bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
            style={{ width: `${Math.min(100, spiceLevel)}%` }}
          />
        </div>
      </div>
      {gameState === "paused" ? (
        <div className="col-span-full rounded-lg border border-amber-300/50 bg-amber-900/30 p-2 text-center text-xs text-amber-100">
          Game paused. Press P or Resume to continue.
        </div>
      ) : null}
    </section>
  );
};

export default ScoreBoard;
