import { useState } from "react";

interface GameOverModalProps {
  score: number;
  bestScore: number;
  defaultName: string;
  onSubmitScore: (name: string) => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

const GameOverModal = ({
  score,
  bestScore,
  defaultName,
  onSubmitScore,
  onPlayAgain,
  onMainMenu,
}: GameOverModalProps) => {
  const [name, setName] = useState(defaultName);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/20 bg-slate-900/95 p-5 shadow-xl">
        <h2 className="text-xl font-bold text-white">Game Over</h2>
        <p className="mt-2 text-sm text-slate-200">Final score: {score}</p>
        <p className="text-sm text-slate-300">Best score: {bestScore}</p>

        <label
          htmlFor="player-name"
          className="mt-4 block text-xs uppercase tracking-wide text-slate-300"
        >
          Player Name
        </label>
        <input
          id="player-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-sky-300"
          maxLength={20}
        />

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
            onClick={() => {
              onSubmitScore(name);
              setSubmitted(true);
            }}
            disabled={submitted || score <= 0}
          >
            {submitted ? "Submitted" : "Submit Score"}
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
            onClick={onPlayAgain}
          >
            Play Again
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-600"
            onClick={onMainMenu}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
