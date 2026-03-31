import type { BirdModel, GameWorld, PipeModel } from "../../types";
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  BIRD_X,
  PIPE_GAP,
  PIPE_SPAWN_MS,
  PIPE_SPEED,
  PIPE_WIDTH,
} from "../../utils/constants";
import { applyGravity, velocityToRotation } from "../../utils/physics";

const MIN_GAP_MARGIN = 54;

const GAP_PATTERN = [0.5, 0.44, 0.56, 0.4, 0.6, 0.46, 0.54, 0.42];

const getPatternedGapY = (world: GameWorld, pipeId: number): number => {
  const playAreaHeight = world.height - world.groundHeight;
  const pattern =
    GAP_PATTERN[
      ((pipeId % GAP_PATTERN.length) + GAP_PATTERN.length) % GAP_PATTERN.length
    ];
  const targetCenter = playAreaHeight * pattern;
  const centeredGap = targetCenter - PIPE_GAP / 2;
  const minGapY = MIN_GAP_MARGIN;
  const maxGapY = playAreaHeight - PIPE_GAP - MIN_GAP_MARGIN;
  return Math.max(minGapY, Math.min(maxGapY, centeredGap));
};

export const createBird = (world: GameWorld): BirdModel => {
  const startX = Math.max(BIRD_X, Math.floor(world.width * 0.18));
  return {
    x: startX,
    y: world.height / 2 - BIRD_HEIGHT / 2,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
    velocityY: 0,
    rotation: 0,
  };
};

export const createPipe = (id: number, world: GameWorld): PipeModel => {
  const gapY = getPatternedGapY(world, id);

  return {
    id,
    x: world.width + PIPE_WIDTH,
    width: PIPE_WIDTH,
    gapY,
    gapHeight: PIPE_GAP,
    passed: false,
  };
};

export const updateBird = (bird: BirdModel, dtMs: number): BirdModel => {
  const dtSeconds = dtMs / 1000;
  const velocityY = applyGravity(bird.velocityY, dtSeconds);
  const y = bird.y + velocityY * dtSeconds;

  return {
    ...bird,
    y,
    velocityY,
    rotation: velocityToRotation(velocityY),
  };
};

export const updatePipes = (
  pipes: PipeModel[],
  dtMs: number,
  speedMultiplier: number,
): PipeModel[] => {
  const dtSeconds = dtMs / 1000;
  const speed = PIPE_SPEED * speedMultiplier;

  return pipes
    .map((pipe) => ({ ...pipe, x: pipe.x - speed * dtSeconds }))
    .filter((pipe) => pipe.x + pipe.width > -8);
};

export const shouldSpawnPipe = (
  spawnTimerMs: number,
  spawnIntervalMs: number = PIPE_SPAWN_MS,
): boolean => {
  return spawnTimerMs >= spawnIntervalMs;
};

export const initialPipeSpawn = (world: GameWorld): PipeModel[] => {
  return [
    {
      id: 0,
      x: world.width + 80,
      width: PIPE_WIDTH,
      gapY: getPatternedGapY(world, 0),
      gapHeight: PIPE_GAP,
      passed: false,
    },
  ];
};

export const defaultWorld = (
  width: number,
  height: number,
  groundHeight: number,
): GameWorld => {
  return {
    width,
    height,
    groundHeight,
  };
};

export const birdDimensions = {
  width: BIRD_WIDTH,
  height: BIRD_HEIGHT,
};
