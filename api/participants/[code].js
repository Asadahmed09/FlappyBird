const DEFAULT_UPSTREAM_BASE = "https://minigame-manager-cc533de7be66.herokuapp.com";

const getUpstreamBase = () =>
  (process.env.MINIGAME_API_BASE || DEFAULT_UPSTREAM_BASE).replace(/\/+$/, "");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;
  if (!code) {
    res.status(400).json({ error: "Missing participant code." });
    return;
  }

  const targetUrl = `${getUpstreamBase()}/api/participants/${encodeURIComponent(code)}`;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
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
