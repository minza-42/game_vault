import type { Game } from "../types/Game";

const API_URL = "https://questlog-api.vercel.app/api";
const HANDLE = "gamevault-minai";

const BASE_URL = `${API_URL}/${HANDLE}`;

export async function getGames(): Promise<Game[]> {
  const response = await fetch(`${BASE_URL}/games`);

  if (!response.ok) {
    throw new Error("Could not fetch games");
  }

  return response.json();
}
