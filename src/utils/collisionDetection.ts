import type { BirdModel, PipeModel } from '../types';

const intersects = (
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean => {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
};

export const birdHitsPipe = (bird: BirdModel, pipe: PipeModel, worldHeight: number, groundHeight: number): boolean => {
  const topPipeHeight = pipe.gapY;
  const bottomPipeY = pipe.gapY + pipe.gapHeight;
  const bottomPipeHeight = worldHeight - groundHeight - bottomPipeY;

  const hitsTop = intersects(bird.x, bird.y, bird.width, bird.height, pipe.x, 0, pipe.width, topPipeHeight);
  const hitsBottom = intersects(
    bird.x,
    bird.y,
    bird.width,
    bird.height,
    pipe.x,
    bottomPipeY,
    pipe.width,
    bottomPipeHeight
  );

  return hitsTop || hitsBottom;
};

export const birdOutOfBounds = (bird: BirdModel, worldHeight: number, groundHeight: number): boolean => {
  return bird.y <= 0 || bird.y + bird.height >= worldHeight - groundHeight;
};
