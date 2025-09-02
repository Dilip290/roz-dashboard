export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    // CORS
    if (req.method === "OPTIONS") return new Response(null, {
      headers: corsHeaders()
    });

    // Routes
    if (url.pathname === "/v1/ping") {
      return json({ ok: true });
    }

    if (url.pathname === "/v1/answer") {
      const q = url.searchParams.get("q") || "";
      const ans = await wikiAnswer(q);
      return json({ answer: ans || null });
    }

    if (url.pathname === "/v1/weather") {
      const city = url.searchParams.get("city") || "Hyderabad";
      const data = await weather(city);
      return json(data);
    }

    if (url.pathname === "/v1/music") {
      const q = url.searchParams.get("q") || "Telugu songs";
      const id = await youtubeEmbeddableId(q, env.YOUTUBE_KEY);
      return json({ videoId: id });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders() });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json(obj, status=200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { "content-type": "application/json", ...corsHeaders() }
  });
}

/* ---------- Wikipedia (search + summary) ---------- */
async function wikiAnswer(q) {
  const t = q.replace(/\?+$/,"").trim();
  // 1) direct summary
  let s = await wikiSummary(t);
  if (s) return s;
  // 2) search → best title → summary
  const sr = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(t)}&limit=1`);
  if (!sr.ok) return null;
  const sj = await sr.json();
  if (sj?.pages?.length) {
    const best = sj.pages[0].title;
    s = await wikiSummary(best);
    if (s) return s;
  }
  return null;
}
async function wikiSummary(title) {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
    headers: { accept: "application/json" }
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j.extract ? j.extract.split(". ").slice(0,2).join(". ") + "." : null;
}

/* ---------- Weather via Open-Meteo ---------- */
async function weather(city) {
  const g = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  const gj = await g.json();
  if (!gj.results?.length) return { error: "CITY_NOT_FOUND" };
  const { latitude, longitude, name, country } = gj.results[0];
  const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code`);
  const wj = await w.json();
  const cur = wj.current || {};
  return { name, country, t: Math.round(cur.temperature_2m), tf: Math.round(cur.apparent_temperature), code: cur.weather_code };
}

/* ---------- YouTube: find an EMBEDDABLE video ---------- */
async function youtubeEmbeddableId(query, API_KEY) {
  if (!API_KEY) return null;
  // search top results
  const s = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&maxResults=8&regionCode=IN&q=${encodeURIComponent(query)}`);
  if (!s.ok) return null;
  const sj = await s.json();
  const ids = (sj.items || []).map(it => it.id.videoId).filter(Boolean);
  if (!ids.length) return null;

  // check embeddable
  const v = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=status,contentDetails&id=${ids.join(",")}`);
  const vj = await v.json();
  const ok = (vj.items || []).find(it => it.status?.embeddable);
  return ok ? ok.id : ids[0]; // fallback anyway
}
