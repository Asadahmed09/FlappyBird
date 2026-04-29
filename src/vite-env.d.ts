/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MINIGAME_API_BASE?: string;
  readonly VITE_MINIGAME_API_KEY?: string;
  readonly VITE_MINIGAME_GAME_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
