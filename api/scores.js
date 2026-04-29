const DEFAULT_UPSTREAM_BASE = "https://minigame-manager-cc533de7be66.herokuapp.com";

const getUpstreamBase = () =>
  (process.env.MINIGAME_API_BASE || DEFAULT_UPSTREAM_BASE).replace(/\/+$/, "");

const normalizePayload = (value) => {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const apiKey = process.env.MINIGAME_API_KEY;
  const gameId = process.env.MINIGAME_GAME_ID;

  if (!apiKey || !gameId) {
    res.status(500).json({ error: "Server is missing API credentials." });
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = {};
    }
  }

  const targetUrl = `${getUpstreamBase()}/api/scores`;
  const body = JSON.stringify({ ...normalizePayload(payload), gameId });

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body,
    });

    const responseText = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get("content-type") || "application/json";

    res.status(upstreamResponse.status);
    res.setHeader("Content-Type", contentType);
    res.send(responseText);
  } catch (error) {
    res.status(502).json({ error: "Upstream request failed." });
  }
}
