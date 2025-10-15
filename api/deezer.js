export default async function handler(req, res) {
  const path = req.url.replace("/api/deezer/", "").replace("/api/deezer", "");
  const deezerUrl = `https://api.deezer.com/${path}`;

  console.log("Proxying to:", deezerUrl);

  try {
    const response = await fetch(deezerUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).json(data);
  } catch (error) {
    console.error("Deezer API Error:", error);
    res.status(500).json({ error: "Failed to fetch from Deezer API" });
  }
}
