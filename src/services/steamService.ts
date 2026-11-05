const STEAM_BACKEND_URL = "http://localhost:3001/api/steam";

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
}

interface SteamGamesResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

export async function getSteamGames(): Promise<SteamGame[]> {
  const response = await fetch(`${STEAM_BACKEND_URL}/games`);

  if (!response.ok) {
    throw new Error(`Steam backend error: ${response.status}`);
  }

  const data: SteamGamesResponse = await response.json();

  return data.response.games;
}
