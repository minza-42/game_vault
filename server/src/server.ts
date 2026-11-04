import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// Test route
app.get("/", (_req, res) => {
  res.json({
    message: "GameVault Steam backend is running!",
  });
});

// Get Steam library
app.get("/api/steam/games", async (_req, res) => {
  try {
    const apiKey = process.env.STEAM_API_KEY;
    const steamId = process.env.STEAM_ID;

    if (!apiKey || !steamId) {
      res.status(500).json({
        error: "Steam API key or Steam ID is missing.",
      });
      return;
    }

    const steamUrl = new URL(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
    );

    steamUrl.searchParams.set("key", apiKey);
    steamUrl.searchParams.set("steamid", steamId);
    steamUrl.searchParams.set("include_appinfo", "true");
    steamUrl.searchParams.set("include_played_free_games", "true");

    const response = await fetch(steamUrl);

    if (!response.ok) {
      throw new Error(`Steam API returned status ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Steam API error:", error);

    res.status(500).json({
      error: "Could not fetch Steam games.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`GameVault backend running on http://localhost:${PORT}`);
});
