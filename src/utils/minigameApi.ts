const DEFAULT_TIMEOUT_MS = 10000;

const MINIGAME_API_BASE = (
  import.meta.env.VITE_MINIGAME_API_BASE || "/api"
).replace(/\/+$/, "");

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
      `${MINIGAME_API_BASE}/participants/${encodeURIComponent(code)}`,
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
  let response: Response;
  try {
    response = await requestWithTimeout(
      `${MINIGAME_API_BASE}/scores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
