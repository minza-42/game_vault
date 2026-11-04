import type { Game, GameStatus } from "../types/Game";

const API_URL = "https://questlog-api.vercel.app/api";
const HANDLE = "gamevault-minai";
const BASE_URL = `${API_URL}/${HANDLE}`;

// GET - Fetch all games
export async function getGames(): Promise<Game[]> {
  const response = await fetch(`${BASE_URL}/games`);

  if (!response.ok) {
    throw new Error("Could not fetch games");
  }

  return response.json();
}

// POST - Create a new game
export interface NewGame {
  title: string;
  platform: string;
  status: GameStatus;
  rating?: number | null;
  notes?: string;
  steamAppId?: number;
  steamPlaytime?: number;
}

export async function createGame(game: NewGame): Promise<Game> {
  const response = await fetch(`${BASE_URL}/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!response.ok) {
    throw new Error("Could not create game");
  }

  return response.json();
}

// PATCH - Update an existing game
interface UpdateGame {
  status?: GameStatus;
  rating?: number | null;
  notes?: string;
}

export async function updateGame(
  id: string,
  updates: UpdateGame,
): Promise<Game> {
  const response = await fetch(`${BASE_URL}/games/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Could not update game");
  }

  return response.json();
}

// DELETE - Remove a game
export async function deleteGame(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/games/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete game");
  }
}
