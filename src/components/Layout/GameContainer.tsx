import { useEffect, useMemo, useState } from "react";
import GameCanvas from "../Game/GameCanvas";
import GameOverModal from "../UI/GameOverModal";
import Leaderboard from "../UI/Leaderboard";
import { useGameContext } from "../../contexts/GameContext";

const faceOptions = [
  { id: "classic", label: "Classic" },
  { id: "cool", label: "Cool" },
  { id: "angry", label: "Angry" },
] as const;

const actionButtonClass =
  "rounded-xl border px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-0.5";

const hudButtonClass =
  "rounded-md border border-orange-200/35 bg-gradient-to-r from-black/55 via-red-900/35 to-orange-900/35 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-orange-50 shadow-md backdrop-blur-sm transition hover:from-black/75 hover:via-red-900/50 hover:to-orange-900/50";

const GameContainer = () => {
  const {
    snapshot,
    leaderboard,
    playerName,
    startGame,
    restart,
    goToMenu,
    flap,
    togglePause,
    toggleMute,
    submitScore,
    setDuckFace,
  } = useGameContext();
  const [showControls, setShowControls] = useState(false);

  const isGameActive = useMemo(
    () => snapshot.gameState !== "menu",
    [snapshot.gameState],
  );
  const showStartFade = snapshot.gameState === "ready";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isSpace = event.code === "Space" || key === " ";
      const isPause = event.code === "KeyP" || key === "p";
      const isRestart = event.code === "KeyR" || key === "r";
      const isMute = event.code === "KeyM" || key === "m";

      if (isSpace) {
        event.preventDefault();
        if (snapshot.gameState === "menu") {
          startGame("classic");
          return;
        }
        if (snapshot.gameState === "paused") {
          togglePause();
          return;
        }
        flap();
      }
      if (isPause) {
        event.preventDefault();
        togglePause();
      }
      if (isRestart) {
        event.preventDefault();
        restart();
      }
      if (isMute) {
        toggleMute();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flap, restart, snapshot.gameState, startGame, toggleMute, togglePause]);

  const handlePrimaryAction = () => {
    if (snapshot.gameState === "menu" || snapshot.gameState === "gameOver") {
      return;
    }
    if (snapshot.gameState === "paused") {
      togglePause();
      return;
    }
    flap();
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative h-full w-full">
        <GameCanvas snapshot={snapshot} onAction={handlePrimaryAction} />

        <div
          className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-500 ${
            snapshot.gameState === "menu"
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-red-950/70 to-orange-950/80" />
          <div className="relative w-full max-w-xl rounded-3xl border border-orange-100/20 bg-gradient-to-br from-slate-900/95 via-red-950/80 to-orange-900/70 p-6 text-center shadow-[0_22px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-orange-200/85">
              Main Menu
            </p>
            <h1 className="mt-2 text-4xl font-black text-orange-100 drop-shadow-md sm:text-5xl">
              Flapy Uran
            </h1>
            <p className="mt-3 text-sm text-orange-100/85">
              Smooth flying, fair challenge, pro arcade feel.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                className={`${actionButtonClass} border-orange-200/55 bg-gradient-to-r from-orange-500/85 via-amber-500/70 to-red-500/85 hover:from-orange-400 hover:via-amber-400/80 hover:to-red-400`}
                onClick={() => startGame("classic")}
              >
                Start Game
              </button>
              <button
                type="button"
                className={`${actionButtonClass} border-orange-200/45 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.22),transparent_35%),linear-gradient(120deg,rgba(17,24,39,0.75),rgba(127,29,29,0.45))] text-orange-100 hover:bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.35),transparent_42%),linear-gradient(120deg,rgba(17,24,39,0.82),rgba(127,29,29,0.56))]`}
                onClick={() => setShowControls((prev) => !prev)}
              >
                Controls
              </button>
              <button
                type="button"
                className={`${actionButtonClass} border-red-200/50 bg-gradient-to-r from-red-600/80 via-rose-600/75 to-orange-600/80 hover:from-red-500 hover:via-rose-500 hover:to-orange-500`}
                onClick={() => startGame("practice")}
              >
                Practice
              </button>
            </div>

            {showControls ? (
              <div className="mt-4 rounded-xl border border-orange-100/20 bg-black/35 p-4 text-left text-sm text-orange-50/95">
                <p>Space / Tap: Flap</p>
                <p>P: Pause / Resume</p>
                <p>R: Restart run</p>
                <p>M: Mute / Unmute</p>
              </div>
            ) : null}

            <div className="mt-4 rounded-xl border border-orange-100/20 bg-black/30 p-4 text-left">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-orange-100/80">
                Duck Face
              </p>
              <div className="grid grid-cols-3 gap-2">
                {faceOptions.map((face) => (
                  <button
                    key={face.id}
                    type="button"
                    onClick={() => setDuckFace(face.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      snapshot.duckFace === face.id
                        ? "border-amber-200/60 bg-gradient-to-r from-orange-500/65 to-red-500/65 text-white"
                        : "border-orange-100/30 bg-black/35 text-orange-100 hover:bg-black/50"
                    }`}
                  >
                    {face.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 text-left">
              <Leaderboard entries={leaderboard} />
            </div>
          </div>
        </div>

        {isGameActive && (
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                showStartFade ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="pointer-events-auto absolute left-3 top-3 flex items-center gap-2 sm:left-5 sm:top-5">
              <button
                type="button"
                onClick={togglePause}
                className={hudButtonClass}
                disabled={snapshot.gameState === "gameOver"}
              >
                {snapshot.gameState === "paused" ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={restart}
                className={hudButtonClass}
              >
                Restart
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className={hudButtonClass}
              >
                {snapshot.muted ? "Unmute" : "Mute"}
              </button>
            </div>

            <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl border border-orange-100/30 bg-gradient-to-r from-black/55 to-red-950/40 px-5 py-2 text-center backdrop-blur-sm sm:top-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-orange-100/90">
                Score
              </p>
              <p className="text-2xl font-black text-amber-300">
                {snapshot.score}
              </p>
              <p className="text-xs text-orange-50/85">
                Best: {snapshot.bestScore}
              </p>
            </div>

            {snapshot.gameState === "ready" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <p className="rounded-xl border border-orange-100/30 bg-gradient-to-r from-red-900/55 to-orange-800/55 px-6 py-3 text-sm font-semibold text-orange-50 shadow-lg backdrop-blur-sm">
                  Get Ready
                </p>
              </div>
            )}

            {snapshot.gameState === "paused" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-orange-100/30 bg-gradient-to-br from-black/75 via-red-950/55 to-orange-950/55 px-6 py-5 text-center shadow-2xl backdrop-blur-md">
                  <p className="text-xl font-bold text-orange-50">Paused</p>
                  <p className="mt-1 text-sm text-orange-100/85">
                    Choose an action to continue your run.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      className="rounded-lg border border-orange-200/55 bg-gradient-to-r from-emerald-500/80 to-lime-500/75 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 transition hover:from-emerald-400 hover:to-lime-400"
                      onClick={togglePause}
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-orange-200/55 bg-gradient-to-r from-orange-500/85 to-red-500/85 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:from-orange-400 hover:to-red-400"
                      onClick={restart}
                    >
                      Restart
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-orange-200/55 bg-gradient-to-r from-sky-500/85 to-cyan-500/85 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 transition hover:from-sky-400 hover:to-cyan-400"
                      onClick={toggleMute}
                    >
                      {snapshot.muted ? "Unmute" : "Mute"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {snapshot.gameState === "gameOver" && (
          <GameOverModal
            score={snapshot.score}
            bestScore={snapshot.bestScore}
            defaultName={playerName}
            onSubmitScore={submitScore}
            onPlayAgain={restart}
            onMainMenu={goToMenu}
          />
        )}
      </section>
    </main>
  );
};

export default GameContainer;
