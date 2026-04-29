import { useEffect, useState } from "react";
import {
  fetchParticipantName,
  type SubmitScoreResult,
} from "../../utils/minigameApi";

interface GameOverModalProps {
  score: number;
  bestScore: number;
  defaultName: string;
  defaultCode: string;
  onSubmitScore: (
    name: string,
    userCode: string,
    saveLocal?: boolean,
  ) => Promise<SubmitScoreResult>;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

const GameOverModal = ({
  score,
  bestScore,
  defaultName,
  defaultCode,
  onSubmitScore,
  onPlayAgain,
  onMainMenu,
}: GameOverModalProps) => {
  const [name, setName] = useState(defaultName);
  const [playerCode, setPlayerCode] = useState(defaultCode);
  const [localSaved, setLocalSaved] = useState(false);
  const [lookupState, setLookupState] = useState<
    "idle" | "loading" | "ok" | "not-found" | "error"
  >("idle");
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    setLookupState("idle");
    setLookupMessage(null);
  }, [playerCode]);

  const handleLookup = async () => {
    setLookupState("loading");
    setLookupMessage(null);

    const result = await fetchParticipantName(playerCode);
    if (result.status === "ok") {
      setName(result.fullName);
      setLookupState("ok");
      setLookupMessage(`Welcome ${result.fullName}.`);
      return;
    }

    if (result.status === "not-found") {
      setLookupState("not-found");
      setLookupMessage("Participant not found.");
      return;
    }

    setLookupState("error");
    setLookupMessage(result.message);
  };

  const handleSubmit = async () => {
    if (score <= 0) {
      return;
    }

    setSubmitState("sending");
    setSubmitMessage(null);

    const saveLocal = !localSaved;
    if (saveLocal) {
      setLocalSaved(true);
    }

    try {
      const result = await onSubmitScore(name, playerCode, saveLocal);
      if (result.ok) {
        setSubmitState("success");
        setSubmitMessage("Score submitted to the server.");
        return;
      }

      const baseMessage =
        result.message || "Submission failed. Please try again.";
      setSubmitState("error");
      setSubmitMessage(
        saveLocal ? `Score saved locally. ${baseMessage}` : baseMessage,
      );
    } catch (error) {
      const baseMessage =
        error instanceof Error
          ? error.message
          : "Submission failed. Please try again.";
      setSubmitState("error");
      setSubmitMessage(
        saveLocal ? `Score saved locally. ${baseMessage}` : baseMessage,
      );
    }
  };

  const isLookingUp = lookupState === "loading";
  const isSubmitting = submitState === "sending";
  const isSubmitted = submitState === "success";
  const canLookup = playerCode.trim().length > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/20 bg-slate-900/95 p-5 shadow-xl">
        <h2 className="text-xl font-bold text-white">Game Over</h2>
        <p className="mt-2 text-sm text-slate-200">Final score: {score}</p>
        <p className="text-sm text-slate-300">Best score: {bestScore}</p>

        <label
          htmlFor="player-code"
          className="mt-4 block text-xs uppercase tracking-wide text-slate-300"
        >
          Player Code
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="player-code"
            value={playerCode}
            onChange={(event) => setPlayerCode(event.target.value)}
            className="w-full rounded-md border border-white/20 bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-sky-300"
            maxLength={24}
          />
          <button
            type="button"
            className="shrink-0 rounded-md border border-emerald-200/40 bg-emerald-500/80 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            onClick={handleLookup}
            disabled={!canLookup || isLookingUp}
          >
            {isLookingUp ? "Checking" : "Check"}
          </button>
        </div>
        {lookupMessage ? (
          <p
            className={`mt-1 text-xs ${
              lookupState === "ok"
                ? "text-emerald-300"
                : lookupState === "loading"
                  ? "text-slate-300"
                  : "text-amber-200"
            }`}
          >
            {lookupMessage}
          </p>
        ) : null}

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
            onClick={handleSubmit}
            disabled={isSubmitting || isSubmitted || score <= 0}
          >
            {isSubmitting ? "Submitting" : isSubmitted ? "Submitted" : "Submit Score"}
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
        {submitMessage ? (
          <p
            className={`mt-3 text-xs ${
              submitState === "success" ? "text-emerald-300" : "text-amber-200"
            }`}
          >
            {submitMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default GameOverModal;
