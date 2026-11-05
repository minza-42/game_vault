import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getAllSteamGames, getSteamGame, saveSteamGame } from "./database";

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

// Get all saved Steam metadata
app.get("/api/steam/metadata", (_req, res) => {
  try {
    const games = getAllSteamGames();
    res.json(games);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Could not fetch Steam metadata.",
    });
  }
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

// Get saved Steam metadata for one game
app.get("/api/steam/metadata/:appId", (req, res) => {
  const appId = Number(req.params.appId);

  if (!Number.isInteger(appId) || appId <= 0) {
    res.status(400).json({
      error: "Invalid Steam App ID.",
    });
    return;
  }

  try {
    const game = getSteamGame(appId);
    res.json(game ?? null);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Could not fetch Steam metadata.",
    });
  }
});

// Save or update Steam metadata
app.put("/api/steam/metadata", (req, res) => {
  const { appId, questlogGameId, playtimeMinutes } = req.body;

  if (
    !Number.isInteger(appId) ||
    appId <= 0 ||
    typeof questlogGameId !== "string" ||
    !questlogGameId.trim() ||
    !Number.isInteger(playtimeMinutes) ||
    playtimeMinutes < 0
  ) {
    res.status(400).json({
      error: "Invalid Steam metadata.",
    });
    return;
  }

  try {
    saveSteamGame(appId, questlogGameId, playtimeMinutes);

    res.json({
      message: "Steam metadata saved successfully.",
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Could not save Steam metadata.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`GameVault backend running on http://localhost:${PORT}`);
});
