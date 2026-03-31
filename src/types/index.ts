export type GameState = "menu" | "ready" | "playing" | "paused" | "gameOver";

export type GameMode = "classic" | "timeAttack" | "survival" | "practice";

export type DuckFace = "classic" | "cool" | "angry";

export interface BirdModel {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  rotation: number;
}

export interface PipeModel {
  id: number;
  x: number;
  width: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
}

export interface GameWorld {
  width: number;
  height: number;
  groundHeight: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  mode: GameMode;
  createdAt: string;
}

export interface SpicePickupModel {
  x: number;
  y: number;
  radius: number;
  rotation: number;
}

export interface GameSnapshot {
  gameState: GameState;
  mode: GameMode;
  duckFace: DuckFace;
  world: GameWorld;
  bird: BirdModel;
  pipes: PipeModel[];
  spicePickup: SpicePickupModel | null;
  score: number;
  bestScore: number;
  combo: number;
  comboTimeLeft: number;
  spiceLevel: number;
  spiceFlashMs: number;
  muted: boolean;
  speedMultiplier: number;
  timeLeftMs: number;
}
