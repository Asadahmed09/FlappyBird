import { GRAVITY, JUMP_FORCE, MAX_FALL_SPEED } from './constants';

export const applyGravity = (velocityY: number, dtSeconds: number): number => {
  return Math.min(velocityY + GRAVITY * dtSeconds, MAX_FALL_SPEED);
};

export const jumpVelocity = (): number => JUMP_FORCE;

export const velocityToRotation = (velocityY: number): number => {
  const normalized = Math.max(-1, Math.min(1, velocityY / MAX_FALL_SPEED));
  return normalized * 55;
};
