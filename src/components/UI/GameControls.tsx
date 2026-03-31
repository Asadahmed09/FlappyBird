import type { GameMode, GameState } from "../../types";

interface GameControlsProps {
  gameState: GameState;
  muted: boolean;
  onStart: (mode: GameMode) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  onMuteToggle: () => void;
}

const modes: GameMode[] = ["classic", "survival", "practice"];

const modeButtonClass: Record<GameMode, string> = {
  classic:
    "border-amber-200/50 bg-gradient-to-r from-amber-500/50 to-orange-500/40 text-amber-50 hover:from-amber-400/65 hover:to-orange-400/55",
  survival:
    "border-emerald-200/50 bg-gradient-to-r from-emerald-500/50 to-lime-500/40 text-emerald-50 hover:from-emerald-400/65 hover:to-lime-400/55",
  practice:
    "border-sky-200/50 bg-gradient-to-r from-sky-500/50 to-cyan-500/40 text-sky-50 hover:from-sky-400/65 hover:to-cyan-400/55",
  timeAttack:
    "border-fuchsia-200/50 bg-gradient-to-r from-fuchsia-500/50 to-pink-500/40 text-fuchsia-50 hover:from-fuchsia-400/65 hover:to-pink-400/55",
};

const GameControls = ({
  gameState,
  muted,
  onStart,
  onPauseToggle,
  onRestart,
  onMuteToggle,
}: GameControlsProps) => {
  return (
    <section className="flex w-full max-w-[700px] flex-wrap items-center justify-center gap-2">
      {modes.map((mode) => (
        <button
          key={mode}
          type="button"
          className={`rounded-md border px-3 py-2 text-xs uppercase tracking-wide transition ${modeButtonClass[mode]}`}
          onClick={() => onStart(mode)}
        >
          Start {mode}
        </button>
      ))}
      <button
        type="button"
        className="rounded-md border border-violet-200/50 bg-gradient-to-r from-violet-500/50 to-indigo-500/40 px-3 py-2 text-xs uppercase tracking-wide text-violet-50 transition hover:from-violet-400/65 hover:to-indigo-400/55"
        onClick={onPauseToggle}
        disabled={gameState === "menu" || gameState === "gameOver"}
      >
        {gameState === "paused" ? "Resume" : "Pause"}
      </button>
      <button
        type="button"
        className="rounded-md border border-rose-200/50 bg-gradient-to-r from-rose-500/55 to-red-500/45 px-3 py-2 text-xs uppercase tracking-wide text-rose-50 transition hover:from-rose-400/65 hover:to-red-400/55"
        onClick={onRestart}
      >
        Restart
      </button>
      <button
        type="button"
        className="rounded-md border border-teal-200/50 bg-gradient-to-r from-teal-500/55 to-cyan-500/45 px-3 py-2 text-xs uppercase tracking-wide text-teal-50 transition hover:from-teal-400/65 hover:to-cyan-400/55"
        onClick={onMuteToggle}
      >
        {muted ? "Unmute" : "Mute"}
      </button>
    </section>
  );
};

export default GameControls;
