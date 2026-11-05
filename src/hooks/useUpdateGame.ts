import { useState } from "react";
import { updateGame } from "../services/gameService";
import type { Game } from "../types/Game";
import type { UpdateGame } from "../services/gameService";

function useUpdateGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveChanges(id: string, updates: UpdateGame): Promise<Game> {
    try {
      setLoading(true);
      setError(null);

      const updatedGame = await updateGame(id, updates);

      return updatedGame;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { saveChanges, loading, error };
}

export default useUpdateGame;
