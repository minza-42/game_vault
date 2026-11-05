const STEAM_BACKEND_URL = "http://localhost:3001/api/steam";

export interface SteamMetadata {
  steam_app_id: number;
  questlog_game_id: string | null;
  playtime_minutes: number;
  updated_at: string;
}

// Get all saved Steam metadata
export async function getAllSteamMetadata(): Promise<SteamMetadata[]> {
  const response = await fetch(`${STEAM_BACKEND_URL}/metadata`);

  if (!response.ok) {
    throw new Error("Could not fetch Steam metadata.");
  }

  return response.json();
}

// Get saved metadata for one Steam game
export async function getSteamMetadata(
  appId: number,
): Promise<SteamMetadata | null> {
  const response = await fetch(`${STEAM_BACKEND_URL}/metadata/${appId}`);

  if (!response.ok) {
    throw new Error("Could not fetch Steam metadata.");
  }

  return response.json();
}

// Save or update metadata for a Steam game
export async function saveSteamMetadata(
  appId: number,
  questlogGameId: string,
  playtimeMinutes: number,
): Promise<void> {
  const response = await fetch(`${STEAM_BACKEND_URL}/metadata`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appId,
      questlogGameId,
      playtimeMinutes,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not save Steam metadata.");
  }
}
