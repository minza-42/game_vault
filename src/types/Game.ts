export type GameStatus = "want" | "playing" | "completed" | "dropped";

export interface Game {
  id: string;
  title: string;
  platform: string;
  status: GameStatus;
  rating: number | null;
  coverUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;

  // Steam information
  steamAppId?: number;
  steamPlaytime?: number;
}
