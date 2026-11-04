import { useState } from "react";
import { updateGame } from "../services/gameService";
import type { Game, GameStatus } from "../types/Game";

interface GameUpdates {
  status?: GameStatus;
  rating?: number | null;
  notes?: string;
}

function useUpdateGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveChanges(id: string, updates: GameUpdates): Promise<Game> {
    try {
      setLoading(true);
      setError(null);

      const updatedGame = await updateGame(id, updates);

      return updatedGame;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update game";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { saveChanges, loading, error };
}

export default useUpdateGame;
