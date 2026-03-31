import { useCallback, useEffect, useRef, useState } from "react";
import { useLeaderboard } from "./useLeaderboard";
import { useAudio } from "./useAudio";
import type { DuckFace, GameMode, GameSnapshot } from "../types";
import {
  COMBO_WINDOW_MS,
  GROUND_HEIGHT,
  JUMP_FORCE,
  PIPE_SPAWN_MAX_MS,
  PIPE_SPAWN_MIN_MS,
  SETTINGS_KEY,
  SPICE_PICKUP_INTERVAL_MS,
  TIME_ATTACK_MS,
} from "../utils/constants";
import { birdHitsPipe, birdOutOfBounds } from "../utils/collisionDetection";
import { useLocalStorage } from "./useLocalStorage";
import {
  createBird,
  createPipe,
  defaultWorld,
  initialPipeSpawn,
  shouldSpawnPipe,
  updateBird,
  updatePipes,
} from "../components/Game/GameLogic";
import { useGameLoop } from "../components/Game/useGameLoop";

interface GameSettings {
  muted: boolean;
  playerName: string;
  duckFace: DuckFace;
}

const defaultSettings: GameSettings = {
  muted: false,
  playerName: "Player",
  duckFace: "classic",
};

const randomPipeSpawnMs = () => {
  const minMs = Math.min(PIPE_SPAWN_MIN_MS, PIPE_SPAWN_MAX_MS);
  const maxMs = Math.max(PIPE_SPAWN_MIN_MS, PIPE_SPAWN_MAX_MS);
  // Average two random samples to bias toward mid-range spacing and reduce extreme streaks.
  const centeredRandom = (Math.random() + Math.random()) / 2;
  return minMs + centeredRandom * (maxMs - minMs);
};

const getViewportWorld = () => {
  if (typeof window === "undefined") {
    return defaultWorld(400, 640, GROUND_HEIGHT);
  }

  const width = Math.max(320, window.innerWidth);
  const height = Math.max(500, window.innerHeight);
  const groundHeight = Math.max(72, Math.min(140, Math.round(height * 0.15)));

  return defaultWorld(width, height, groundHeight);
};

const getPickupLaneY = (snapshot: GameSnapshot) => {
  const playArea = snapshot.world.height - snapshot.world.groundHeight;
  return Math.max(120, Math.min(playArea - 120, playArea * 0.48));
};

const createInitialSnapshot = (
  mode: GameMode,
  muted: boolean,
  duckFace: DuckFace,
): GameSnapshot => {
  const world = getViewportWorld();
  return {
    gameState: "menu",
    mode,
    duckFace,
    world,
    bird: createBird(world),
    pipes: initialPipeSpawn(world),
    spicePickup: null,
    score: 0,
    bestScore: 0,
    combo: 0,
    comboTimeLeft: 0,
    spiceLevel: 0,
    spiceFlashMs: 0,
    muted,
    speedMultiplier: 1,
    timeLeftMs: mode === "timeAttack" ? TIME_ATTACK_MS : 0,
  };
};

export const useGameEngine = () => {
  const [settings, setSettings] = useLocalStorage<GameSettings>(
    SETTINGS_KEY,
    defaultSettings,
  );
  const { topTen, addEntry } = useLeaderboard();

  const [snapshot, setSnapshot] = useState<GameSnapshot>(() =>
    createInitialSnapshot("classic", settings.muted, settings.duckFace),
  );
  const { playSound } = useAudio(snapshot.muted);
  const pipeIdRef = useRef(1);
  const spawnTimerRef = useRef(0);
  const nextPipeSpawnMsRef = useRef(randomPipeSpawnMs());
  const readyTimeoutRef = useRef<number | null>(null);
  const spiceSpawnTimerRef = useRef(0);
  const elapsedPlayTimeRef = useRef(0);

  useEffect(() => {
    const onResize = () => {
      const resizedWorld = getViewportWorld();
      setSnapshot((prev) => {
        const sameSize =
          prev.world.width === resizedWorld.width &&
          prev.world.height === resizedWorld.height &&
          prev.world.groundHeight === resizedWorld.groundHeight;

        if (sameSize) {
          return prev;
        }

        const playableHeight = resizedWorld.height - resizedWorld.groundHeight;
        return {
          ...prev,
          world: resizedWorld,
          bird: {
            ...prev.bird,
            y: Math.min(
              Math.max(0, prev.bird.y),
              playableHeight - prev.bird.height,
            ),
          },
          pipes: prev.pipes.map((pipe) => ({
            ...pipe,
            gapY: Math.max(
              54,
              Math.min(playableHeight - pipe.gapHeight - 54, pipe.gapY),
            ),
          })),
        };
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (readyTimeoutRef.current !== null) {
        window.clearTimeout(readyTimeoutRef.current);
      }
    };
  }, []);

  const clearReadyTimeout = useCallback(() => {
    if (readyTimeoutRef.current !== null) {
      window.clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
  }, []);

  const startGame = useCallback(
    (mode: GameMode = "classic") => {
      clearReadyTimeout();
      spawnTimerRef.current = 0;
      nextPipeSpawnMsRef.current = randomPipeSpawnMs();
      pipeIdRef.current = 1;
      spiceSpawnTimerRef.current = 0;
      elapsedPlayTimeRef.current = 0;
      setSnapshot((prev) => {
        const next = createInitialSnapshot(mode, prev.muted, prev.duckFace);
        next.bestScore = prev.bestScore;
        next.gameState = "ready";
        return next;
      });
      playSound("start");

      readyTimeoutRef.current = window.setTimeout(() => {
        setSnapshot((prev) => ({ ...prev, gameState: "playing" }));
        readyTimeoutRef.current = null;
      }, 500);
    },
    [clearReadyTimeout, playSound],
  );

  const restart = useCallback(() => {
    startGame(snapshot.mode);
  }, [snapshot.mode, startGame]);

  const goToMenu = useCallback(() => {
    clearReadyTimeout();
    elapsedPlayTimeRef.current = 0;
    setSnapshot((prev) => {
      const next = createInitialSnapshot(prev.mode, prev.muted, prev.duckFace);
      next.bestScore = prev.bestScore;
      next.gameState = "menu";
      return next;
    });
  }, [clearReadyTimeout]);

  const flap = useCallback(() => {
    setSnapshot((prev) => {
      if (prev.gameState === "menu") {
        return prev;
      }
      if (prev.gameState === "gameOver") {
        return prev;
      }

      playSound("jump");

      return {
        ...prev,
        gameState: prev.gameState === "ready" ? "playing" : prev.gameState,
        bird: {
          ...prev.bird,
          velocityY: JUMP_FORCE,
          rotation: -25,
        },
      };
    });
  }, [playSound]);

  const togglePause = useCallback(() => {
    setSnapshot((prev) => {
      if (prev.gameState === "playing") {
        return { ...prev, gameState: "paused" };
      }
      if (prev.gameState === "paused") {
        return { ...prev, gameState: "playing" };
      }
      return prev;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, muted: !prev.muted }));
    setSettings((prev) => ({ ...prev, muted: !prev.muted }));
  }, [setSettings]);

  const setPlayerName = useCallback(
    (name: string) => {
      setSettings((prev) => ({ ...prev, playerName: name.trim() || "Player" }));
    },
    [setSettings],
  );

  const setDuckFace = useCallback(
    (duckFace: DuckFace) => {
      setSnapshot((prev) => ({ ...prev, duckFace }));
      setSettings((prev) => ({ ...prev, duckFace }));
    },
    [setSettings],
  );

  const submitScore = useCallback(
    (name: string) => {
      setSnapshot((prev) => {
        if (prev.score > 0) {
          addEntry(name.trim() || settings.playerName, prev.score, prev.mode);
        }
        return prev;
      });
    },
    [addEntry, settings.playerName],
  );

  const onFrame = useCallback(
    (dtMs: number) => {
      setSnapshot((prev) => {
        if (prev.gameState !== "playing") {
          return prev;
        }

        elapsedPlayTimeRef.current += dtMs;

        const nextBird = updateBird(prev.bird, dtMs);
        const nextPipes = updatePipes(prev.pipes, dtMs, prev.speedMultiplier);
        let nextScore = prev.score;
        let nextCombo = prev.combo;
        let nextComboTimeLeft = Math.max(0, prev.comboTimeLeft - dtMs);
        let nextBest = prev.bestScore;
        let nextSpeedMultiplier = prev.speedMultiplier;
        let nextTimeLeft = prev.timeLeftMs;
        let nextSpiceLevel = Math.max(0, prev.spiceLevel - dtMs * 0.0065);
        let nextSpiceFlashMs = Math.max(0, prev.spiceFlashMs - dtMs);
        let nextSpicePickup = prev.spicePickup
          ? {
              ...prev.spicePickup,
              x:
                prev.spicePickup.x - (150 * prev.speedMultiplier * dtMs) / 1000,
              rotation: prev.spicePickup.rotation + dtMs * 0.22,
            }
          : null;

        if (nextComboTimeLeft === 0) {
          nextCombo = 0;
        }

        let workingPipes = nextPipes.map((pipe) => {
          if (!pipe.passed && pipe.x + pipe.width < nextBird.x) {
            const updatedCombo = nextComboTimeLeft > 0 ? nextCombo + 1 : 1;
            nextCombo = updatedCombo;
            nextComboTimeLeft = COMBO_WINDOW_MS;
            nextScore += 1;
            if (updatedCombo >= 4) {
              nextSpiceLevel = Math.min(100, nextSpiceLevel + 5);
            }
            playSound("score");
            return { ...pipe, passed: true };
          }
          return pipe;
        });

        if (
          nextSpicePickup &&
          nextSpicePickup.x + nextSpicePickup.radius < -6
        ) {
          nextSpicePickup = null;
        }

        if (!nextSpicePickup) {
          if (spiceSpawnTimerRef.current >= SPICE_PICKUP_INTERVAL_MS) {
            nextSpicePickup = {
              x: prev.world.width + 36,
              y: getPickupLaneY(prev),
              radius: 12,
              rotation: 0,
            };
            spiceSpawnTimerRef.current = 0;
          } else {
            spiceSpawnTimerRef.current += dtMs;
          }
        } else {
          spiceSpawnTimerRef.current += dtMs;
        }

        if (nextSpicePickup) {
          const closestX = Math.max(
            nextBird.x,
            Math.min(nextSpicePickup.x, nextBird.x + nextBird.width),
          );
          const closestY = Math.max(
            nextBird.y,
            Math.min(nextSpicePickup.y, nextBird.y + nextBird.height),
          );
          const dx = nextSpicePickup.x - closestX;
          const dy = nextSpicePickup.y - closestY;

          if (
            dx * dx + dy * dy <=
            nextSpicePickup.radius * nextSpicePickup.radius
          ) {
            nextCombo = Math.max(1, nextCombo) + 1;
            nextComboTimeLeft = COMBO_WINDOW_MS;
            nextSpiceLevel = Math.min(100, nextSpiceLevel + 24);
            nextSpiceFlashMs = 550;
            nextSpicePickup = null;
            playSound("score");
          }
        }

        if (nextScore > nextBest) {
          nextBest = nextScore;
        }

        if (
          shouldSpawnPipe(spawnTimerRef.current, nextPipeSpawnMsRef.current)
        ) {
          spawnTimerRef.current = 0;
          workingPipes = [
            ...workingPipes,
            createPipe(pipeIdRef.current, prev.world),
          ];
          pipeIdRef.current += 1;
          nextPipeSpawnMsRef.current = randomPipeSpawnMs();
        } else {
          spawnTimerRef.current += dtMs;
        }

        const scoreRamp = Math.min(0.65, nextScore * 0.015);
        const elapsedSeconds = elapsedPlayTimeRef.current / 1000;
        const timeRamp = Math.min(0.22, elapsedSeconds * 0.0025);
        if (prev.mode === "practice") {
          nextSpeedMultiplier = 0.9 + scoreRamp * 0.28 + timeRamp * 0.2;
        } else {
          nextSpeedMultiplier = 1 + scoreRamp + timeRamp;
        }

        if (nextCombo >= 4) {
          nextSpeedMultiplier += 0.025;
        }

        nextSpeedMultiplier = Math.min(1.75, nextSpeedMultiplier);

        if (prev.mode === "timeAttack") {
          nextTimeLeft = Math.max(0, prev.timeLeftMs - dtMs);
          if (nextTimeLeft === 0) {
            return {
              ...prev,
              gameState: "gameOver",
              bird: nextBird,
              pipes: workingPipes,
              spicePickup: nextSpicePickup,
              score: nextScore,
              combo: nextCombo,
              comboTimeLeft: nextComboTimeLeft,
              spiceLevel: nextSpiceLevel,
              spiceFlashMs: nextSpiceFlashMs,
              bestScore: nextBest,
              speedMultiplier: nextSpeedMultiplier,
              timeLeftMs: nextTimeLeft,
            };
          }
        }

        const hitPipe = workingPipes.some((pipe) =>
          birdHitsPipe(
            nextBird,
            pipe,
            prev.world.height,
            prev.world.groundHeight,
          ),
        );
        const outOfBounds = birdOutOfBounds(
          nextBird,
          prev.world.height,
          prev.world.groundHeight,
        );

        if ((hitPipe || outOfBounds) && prev.gameState === "playing") {
          playSound("die");
        }

        return {
          ...prev,
          gameState: hitPipe || outOfBounds ? "gameOver" : prev.gameState,
          bird: nextBird,
          pipes: workingPipes,
          spicePickup: nextSpicePickup,
          score: nextScore,
          combo: nextCombo,
          comboTimeLeft: nextComboTimeLeft,
          spiceLevel: nextSpiceLevel,
          spiceFlashMs: nextSpiceFlashMs,
          bestScore: nextBest,
          speedMultiplier: nextSpeedMultiplier,
          timeLeftMs: nextTimeLeft,
        };
      });
    },
    [playSound],
  );

  useGameLoop(onFrame, snapshot.gameState === "playing");

  return {
    snapshot,
    leaderboard: topTen,
    playerName: settings.playerName,
    startGame,
    restart,
    goToMenu,
    flap,
    togglePause,
    toggleMute,
    submitScore,
    setPlayerName,
    setDuckFace,
  };
};
