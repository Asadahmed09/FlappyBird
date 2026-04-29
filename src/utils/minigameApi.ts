const DEFAULT_TIMEOUT_MS = 10000;

const MINIGAME_API_BASE = (
  import.meta.env.VITE_MINIGAME_API_BASE ||
  "https://minigame-manager-cc533de7be66.herokuapp.com"
).replace(/\/+$/, "");

const MINIGAME_API_KEY =
  import.meta.env.VITE_MINIGAME_API_KEY ||
  "mgk_452d0f14dc0b43eaf9e4455c8f7ae5ad2d772da496edbfb5b75f2643838340d0";

const MINIGAME_GAME_ID =
  import.meta.env.VITE_MINIGAME_GAME_ID ||
  "4dde71bf-2109-4f15-8c5e-75961108f774";

const requestWithTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};

const safeJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export type ParticipantLookupResult =
  | { status: "ok"; fullName: string }
  | { status: "not-found" }
  | { status: "error"; message: string };

export const fetchParticipantName = async (
  userCode: string,
): Promise<ParticipantLookupResult> => {
  const code = userCode.trim();
  if (!code) {
    return { status: "error", message: "Enter a player code first." };
  }

  let response: Response;
  try {
    response = await requestWithTimeout(
      `${MINIGAME_API_BASE}/api/participants/${encodeURIComponent(code)}`,
      { method: "GET" },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach the server.";
    return { status: "error", message };
  }

  if (response.status === 404) {
    return { status: "not-found" };
  }

  if (!response.ok) {
    const message = (await response.text()) || `Request failed (${response.status}).`;
    return { status: "error", message };
  }

  const data = (await safeJson(response)) as { fullName?: unknown } | null;
  const fullName = typeof data?.fullName === "string" ? data.fullName : "";

  return { status: "ok", fullName };
};

export interface SubmitScorePayload {
  userCode: string;
  score: number;
  playTime: number;
  metadata?: Record<string, unknown>;
}

export interface SubmitScoreResult {
  ok: boolean;
  message?: string;
  statusCode?: number;
  data?: unknown;
}

export const submitScore = async (
  payload: SubmitScorePayload,
): Promise<SubmitScoreResult> => {
  if (!MINIGAME_API_KEY || !MINIGAME_GAME_ID) {
    return {
      ok: false,
      message: "Missing API configuration for score submission.",
    };
  }

  let response: Response;
  try {
    response = await requestWithTimeout(
      `${MINIGAME_API_BASE}/api/scores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MINIGAME_API_KEY,
        },
        body: JSON.stringify({ ...payload, gameId: MINIGAME_GAME_ID }),
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach the server.";
    return { ok: false, message };
  }

  if (!response.ok) {
    const message = (await response.text()) || `Request failed (${response.status}).`;
    return { ok: false, message, statusCode: response.status };
  }

  const data = await safeJson(response);
  return { ok: true, data };
};
